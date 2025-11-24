"""
極簡字典 - 後端代理服務器
功能：突破 CORS 限制，抓取 Cambridge Dictionary 的繁體中文翻譯
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import re

app = Flask(__name__)
CORS(app)  # 允許所有來源的跨域請求

@app.route('/api/translate', methods=['GET'])
def translate():
    """
    查詢單字的繁體中文翻譯（cdict.info）和美式發音（Cambridge）
    參數: word (字串) - 要查詢的英文單字
    返回: JSON 格式的詞性、翻譯、例句和音檔 URL
    """
    word = request.args.get('word', '').strip().lower()
    
    if not word:
        return jsonify({'error': '請提供單字參數'}), 400
    
    try:
        # 從 cdict.info 抓取翻譯（主要來源）
        cdict_data = fetch_cdict(word)
        
        # 從 Cambridge 抓取音檔
        audio_url = fetch_audio_url(word)
        
        # 如果 cdict 有資料
        if cdict_data['definitions']:
            return jsonify({
                'word': word,
                'phonetics': cdict_data['phonetics'],
                'definitions': cdict_data['definitions'],
                'audio_url': audio_url,
                'source': 'cdict.info + Cambridge Audio'
            })
        
        # 如果 cdict 失敗，回退到 Cambridge
        cambridge_translations = fetch_cambridge(word)
        if cambridge_translations:
            return jsonify({
                'word': word,
                'phonetics': {},
                'definitions': [{
                    'pos': '翻譯',
                    'meanings': cambridge_translations,
                    'examples': []
                }],
                'audio_url': audio_url,
                'source': 'Cambridge Dictionary (fallback)'
            })
        
        # 都失敗
        return jsonify({
            'word': word,
            'phonetics': {},
            'definitions': [],
            'audio_url': audio_url,
            'message': '未找到翻譯'
        }), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500






def fetch_cdict(word):
    """
    從 cdict.info 抓取詳細翻譯、詞性和例句
    資料來源：cdict.info 天火字典
    """
    url = f'https://cdict.info/query/{word}'
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text()
        
        result = {
            'phonetics': {},
            'definitions': []
        }
        
        # 提取 KK 音標
        kk_match = re.search(r'KK 音標〔\s*([^\]〕]+)\s*〕', text)
        if kk_match:
            result['phonetics']['kk'] = kk_match.group(1).strip()
        
        # 提取詞性和定義
        # 找「【詞性】」標記
        pos_pattern = r'【(不及物動詞|及物動詞|形容詞|名詞|副詞|感嘆詞|動詞|代名詞|連接詞|介系詞)】([^【]+?)(?=【|返回|$)'
        
        matches = re.finditer(pos_pattern, text, re.DOTALL)
        
        for match in matches:
            pos = match.group(1)
            content = match.group(2)
            
            meanings = []
            examples = []
            
            # 按數字編號分割定義
            # 格式: "1 翻譯  例句  2 翻譯  例句"
            items = re.split(r'(?=\d+\s+[^\d])', content)
            
            for item in items:
                item = item.strip()
                if not item or not re.match(r'^\d+', item):
                    continue
                
                # 移除開頭的數字
                item = re.sub(r'^\d+\s+', '', item)
                
                # 分離中文翻譯和英文例句
                # 策略：中文在前，遇到全大寫開頭的英文單詞可能是例句
                
                # 先提取所有句子（包含中英文）
                sentences = item.split('  ')  # cdict 用兩個空格分隔
                
                for sent in sentences:
                    sent = sent.strip()
                    if not sent:
                        continue
                    
                    # 判斷是翻譯還是例句
                    # 如果包含中文且以中文開頭，是翻譯
                    if re.match(r'[\u4e00-\u9fff]', sent):
                        # 提取純中文部分（翻譯）
                        pure_chinese = re.split(r'\s+[A-Z]', sent)[0]
                        pure_chinese = pure_chinese.strip().rstrip('，；。、')
                        
                        if pure_chinese and len(pure_chinese) <= 40:
                            meanings.append(pure_chinese)
                    
                    # 如果以大寫英文字母開頭，可能是例句
                    if re.match(r'[A-Z]', sent):
                        # 提取英文句子（以句點、問號、驚嘆號結尾）
                        example_match = re.search(r'([A-Z][^。]*?[.!?])', sent)
                        if example_match:
                            examples.append(example_match.group(1).strip())
            
            # 去重並限制數量
            unique_meanings = []
            seen = set()
            for m in meanings:
                if m not in seen and len(unique_meanings) < 5:
                    seen.add(m)
                    unique_meanings.append(m)
            
            if unique_meanings:
                result['definitions'].append({
                    'pos': pos,
                    'meanings': unique_meanings,
                    'examples': examples[:3]
                })
        
        return result
        
    except requests.RequestException as e:
        print(f'Error fetching from cdict: {e}')
        return {'phonetics': {}, 'definitions': []}


def fetch_audio_url(word):
    """
    從 Cambridge Dictionary 抓取美式英語發音音檔 URL
    """
    url = f'https://dictionary.cambridge.org/dictionary/english/{word}'
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 查找美式音檔 (路徑包含 /us_pron/)
        audio_sources = soup.find_all('source', {'type': 'audio/mpeg'})
        
        for source in audio_sources:
            src = source.get('src', '')
            # 尋找美式發音 (us_pron) 而非英式 (uk_pron)
            if '/us_pron/' in src:
                # 如果是相對路徑，補全為完整 URL
                if src.startswith('//'):
                    return 'https:' + src
                elif src.startswith('/'):
                    return 'https://dictionary.cambridge.org' + src
                else:
                    return src
        
        # 如果找不到美式音檔，返回 None
        return None
        
    except requests.RequestException as e:
        print(f'Error fetching audio from Cambridge: {e}')
        return None


def fetch_cambridge(word):
    """
    從 Cambridge Dictionary 抓取繁體中文翻譯（僅核心字義，非例句）
    """
    url = f'https://dictionary.cambridge.org/dictionary/english-chinese-traditional/{word}'
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        translations = []
        seen = set()  # 用於去重
        
        # 方法1: 查找 class='Ref' 的連結內的翻譯（情緒、態度等抽象意義）
        ref_links = soup.find_all('a', class_='Ref')
        
        for link in ref_links:
            # 取得 <a class="Ref"> 內的 <span> 文字
            span = link.find('span')
            if span:
                text = span.get_text(strip=True)
            else:
                text = link.get_text(strip=True)
            
            # 只保留中文字符且長度合理（過濾長例句）
            if text and re.search(r'[\u4e00-\u9fff]', text):
                # 過濾條件：不包含句號、問號、感嘆號、分號等句子結束符號
                # 且長度不超過15個字符（避免例句）
                if not re.search(r'[。？！；]', text) and len(text) <= 15:
                    # 移除括號內容（如 "(使)"）和多餘分號
                    text = re.sub(r'\([^)]*\)', '', text).strip()
                    text = re.sub(r'；+$', '', text).strip()  # 移除尾部分號
                    if text and text not in seen:
                        translations.append(text)
                        seen.add(text)
        
        # 方法2: 查找 class='trans' 的翻譯（包含具體意義如「苦的」）
        # 這會找到所有定義中的核心翻譯
        trans_elements = soup.find_all('span', class_='trans')
        
        for trans in trans_elements:
            text = trans.get_text(strip=True)
            if text and re.search(r'[\u4e00-\u9fff]', text):
                # 同樣的過濾條件
                if not re.search(r'[。？！；]', text) and len(text) <= 15:
                    text = re.sub(r'\([^)]*\)', '', text).strip()
                    text = re.sub(r'；+$', '', text).strip()
                    if text and text not in seen:
                        translations.append(text)
                        seen.add(text)
        
        # 方法3: 特別查找 class='dtrans dtrans-se' 的翻譯（主要定義）
        dtrans_elements = soup.find_all('span', class_='dtrans')
        
        for dtrans in dtrans_elements:
            text = dtrans.get_text(strip=True)
            if text and re.search(r'[\u4e00-\u9fff]', text):
                if not re.search(r'[。？！；]', text) and len(text) <= 15:
                    text = re.sub(r'\([^)]*\)', '', text).strip()
                    text = re.sub(r'；+$', '', text).strip()
                    if text and text not in seen:
                        translations.append(text)
                        seen.add(text)
        
        # 只返回前10個翻譯（避免過多）
        return translations[:10]
        
    except requests.RequestException as e:
        print(f'Error fetching from Cambridge: {e}')
        return []


@app.route('/api/health', methods=['GET'])
def health():
    """健康檢查端點"""
    return jsonify({'status': 'ok', 'message': '極簡字典 API 運行中'})


if __name__ == '__main__':
    import os
    # Railway 會提供 PORT 環境變數
    port = int(os.environ.get('PORT', 5000))
    print('極簡字典後端服務器啟動中...')
    print(f'API 端點: http://0.0.0.0:{port}/api/translate?word=hello')
    print(f'健康檢查: http://0.0.0.0:{port}/api/health')
    # debug=False 用於生產環境
    app.run(host='0.0.0.0', port=port, debug=False)
