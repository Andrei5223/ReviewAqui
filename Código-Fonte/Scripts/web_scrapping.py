import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager  # para gerenciar o driver
from selenium.webdriver.common.by import By
import time
import json
import sys

def web_scrap_amazon(url: str = 'https://www.amazon.com.br/TAKE-TWO-GTA-V/dp/B0B12DV64Y/'):
    result = {}

    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',
        'Accept-Language': 'pt-BR'
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.text, 'html.parser')

        try:
            img = soup.find('img', id='landingImage')
            img_src = img['src'] if img else None
            result["img_src"] = img_src
        except AttributeError:
            result["img_src"] = "Não disponível"

        try:
            developers = soup.find('a', id='bylineInfo').text.replace('\n', '').replace('Marca:', '').strip()
            result["developers"] = developers
        except AttributeError:
            result["developers"] = "Não disponível"

        try:
            platform = soup.find('div', id='platformInformation_feature_div').text.replace('\n', '').replace('Plataforma :', '').strip()
            result["platform"] = platform
        except AttributeError:
            result["platform"] = "Não disponível"

        try:
            users_summary_review = (soup.find('span', class_='a-icon-alt').text.replace('\n', '') + 
                                    ' ' + soup.find('span', id='acrCustomerReviewText').text.replace('\n', ''))
            result["users_summary_review"] = users_summary_review
        except AttributeError:
            result["users_summary_review"] = "Não disponível"

        try:
            price = soup.find('span', class_='aok-offscreen').text.strip()
            result["price"] = price
        except AttributeError:
            result["price"] = "Não disponível"

        try:
            description = (soup.find('div', id='feature-bullets').text.replace('\n', '').replace('Sobre este item', '').replace('›  Ver mais detalhes do produto', '').strip() + '$$' + soup.find('div', id='productDescription').text.replace('\n', '').strip()).split('$$')
            result["description"] = description
        except AttributeError:
            result["description"] = "Não disponível"

        try:
            product_details = soup.find('div', id='detailBullets_feature_div').text.replace('\n', '').replace('Detalhes do produto', '').replace('(Conheça o Top 100 na categoria Games e Consoles)', ' ').replace('  ', '').strip()
            result["product_details"] = product_details
        except AttributeError:
            result["product_details"] = "Não disponível"

        try:
            reviews = soup.find('div', class_='card-padding').text.replace('\n', '').strip().replace('Veja mais avaliações', '').replace('Ordenar avaliações por            Melhores avaliações              Mais recentes      Melhores avaliações  Principais avaliações do Brasil' , '').replace('Imagens nesta avaliação', '').replace('Ocorreu um problema para filtrar as avaliações agora. Tente novamente mais tarde.', '').replace('Ler mais', '').replace('              ', '').split('ÚtilDenunciar')
            result["reviews"] = reviews
        except AttributeError:
            result["reviews"] = "Não disponível"

    else:
        result = {
            "ERROR": "Não foi possível acessar o site indicado"
        }

    game_info_json = json.dumps(result, ensure_ascii=False, indent=4)

    return game_info_json


options = Options()
#options.add_argument("--headless") # Se ativo, retorna em inglês
options.add_argument("--lang=pt-BR")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def scroll_to_bottom():
    last_height = driver.execute_script("return document.body.scrollHeight")
    
    while True:
        # Rola para baixo
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # Espera a página carregar
        time.sleep(0.25)

        # Calcula nova altura e compara com a anterior
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height


def web_scrap_steam(url: str = 'https://store.steampowered.com/app/2322010/God_of_War_Ragnark/'):

    result = {}

    headers = {
        'Accept-Language': 'pt-BR',
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:

        soup = BeautifulSoup(response.text, 'html.parser')

        try:
            img = soup.find('img', class_='game_header_image_full')
            img_src = img['src'] if img else None
            result["img_src"] = img_src
        except AttributeError:
            result["img_src"] = "Não disponível"

        try:
            description = soup.find('div', class_='game_description_snippet').text.strip()
            result["description"] = description
        except AttributeError:
            result["description"] = "Não disponível"

        try:
            users_summary_review = soup.find('div', class_='user_reviews_summary_row').text.replace('\n', '').replace('\t', '').replace('\r', '').strip()
            result["users_summary_review"] = users_summary_review
        except AttributeError:
            result["users_summary_review"] = "Não disponível"

        try:
            date = soup.find('div', class_='date').text.strip()
            result["date"] = date
        except AttributeError:
            result["date"] = "Não disponível"

        try:
            developers = soup.find('div', id='developers_list').text.replace('\n', '').strip()
            result["developers"] = developers
        except AttributeError:
            result["developers"] = "Não disponível"

        #devs = soup.find_all('div', class_='dev_row')

        try:
            popular_genders = soup.find('div', class_='glance_tags popular_tags').text.strip().replace('\t', '').replace('\n', '').replace('\r', ', ').strip()
            result["popular_genders"] = popular_genders
        except AttributeError:
            result["popular_genders"] = "Não disponível"

        try:
            categories = soup.find('div', class_='game_area_features_list_ctn').text.replace('\n', '').strip()
            result["categories"] = categories
        except AttributeError:
            result["categories"] = "Não disponível"

        try:
            price = soup.find('div', class_='game_purchase_price price').text.replace('\t', '').replace('\r', '').replace('\n', '').strip()
            result["price"] = price
        except AttributeError:
            result["price"] = "Não disponível"

        try:
            requiriments = soup.find('div', class_='game_area_sys_req sysreq_content active').text.replace('\n', '').strip()  # SEPARAR PARA AGREGAÇÃO
            result["requiriments"] = requiriments
        except AttributeError:
            result["requiriments"] = "Não disponível"

        try:
            classification_age = soup.find('div', class_='game_rating_required_age').text.replace('\t', '').replace('\r', '').replace('\n', '').strip()
            result["classification_age"] = classification_age
        except AttributeError:
            result["classification_age"] = "Não disponível"

        #compatibility = soup.find('div', class_='_1CTHwmZmi5YE4kovZH_UIl')     # ESQUISITO

        # Colocar gêneros reais: trabalhoso

        #print(soup.find('div', class_='game_area_sys_req sysreq_content active'))

        driver.get(url)

        driver.implicitly_wait(0)

        scroll_to_bottom()

        try:
            reviews_list = []
            reviews_summary = driver.find_elements(By.ID, 'Reviews_summary')
            for review in reviews_summary:
                html_content = review.get_attribute('innerHTML')
                #print(html_content)
                soup = BeautifulSoup(html_content, 'html.parser')
                #print(soup)
                posted_dates = soup.find_all('div', class_='postedDate')
                contents = soup.find_all('div', class_='content')
                persona_names = soup.find_all('div', class_='persona_name')

                for i in range(len(posted_dates)):
                    posted_date = posted_dates[i].text.replace('\t', '').replace('\n', '').replace('Diretamente do Steam', ''). replace('Código do Steam', '')

                    content = contents[i].text.replace('\t', '').replace('\n', '')
                
                    persona_name = persona_names[i].text.replace('\t', '').replace('\n', '')

                    # Crie um dicionário para o review
                    review = {
                        "posted_date": posted_date,
                        "content": content,
                        "persona_name": persona_name
                    }
                
                    # Adicione o dicionário à lista de reviews
                    reviews_list.append(review)

            # result = {"reviews_summary": reviews_list}

            result["reviews_summary"] = reviews_list
            
        except AttributeError:
            result["comments"] = "Não disponível"

        driver.quit()

        #print(soup.find('div', id='user_reviews_filter_score'))
    
    else:
        result = {
            "ERROR": "Não foi possível acessar o site indicado"
        }

    game_info_json = json.dumps(result, ensure_ascii=False, indent=4)

    return game_info_json

# print(web_scrap_steam())

if sys.argv[1] == 'web_scrap_steam':
    print(web_scrap_steam(url = sys.argv[2]))
elif sys.argv[1] == 'web_scrap_amazon':
    print(web_scrap_amazon(url = sys.argv[2]))
