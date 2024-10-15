import requests
from bs4 import BeautifulSoup
import urllib3
import itertools
import json

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
            developers = soup.find('a', id='bylineInfo').text.replace('\n', '').replace('Marca:', '').strip()
            result["developers"] = developers
        except AttributeError:
            print("Desenvolvedores: Informação não disponível.")

        try:
            platform = soup.find('div', id='platformInformation_feature_div').text.replace('\n', '').replace('Plataforma:', '').strip()
            result["platform"] = platform
        except AttributeError:
            print("Plataforma: Informação não disponível.")

        try:
            users_summary_review = (soup.find('span', class_='a-icon-alt').text.replace('\n', '') + 
                                    ' ' + soup.find('span', id='acrCustomerReviewText').text.replace('\n', ''))
            result["users_summary_review"] = users_summary_review
        except AttributeError:
            print("Resumo de avaliações: Informação não disponível.")

        try:
            price = soup.find('span', class_='aok-offscreen').text.strip()
            result["price"] = price
        except AttributeError:
            print("Preço: Informação não disponível.")

        try:
            description = soup.find('div', id='feature-bullets').text.replace('\n', '').replace('›  Ver mais detalhes do produto', '').strip()
            result["description"] = description
        except AttributeError:
            print("Descrição: Informação não disponível.")

        try:
            reviews = soup.find('div', class_='card-padding').text.replace('\n', '').replace('Veja mais avaliações', '').replace('Ordenar avaliações por            Melhores avaliações              Mais recentes      Melhores avaliações  Principais avaliações do Brasil' , '').replace('Imagens nesta avaliação', '').replace('Ocorreu um problema para filtrar as avaliações agora. Tente novamente mais tarde.', '').replace('Ler mais', '').split('ÚtilDenunciar')
            result["reviews"] = reviews
        except AttributeError:
            print("Descrição: Informação não disponível.")    

        # Para a data, você pode descomentar se quiser:
        # try:
        #     date = soup.find('span', class_='a-list-item').text.replace('Data de lançamento :', '').strip()
        #     result["date"] = date
        # except AttributeError:
        #     print("Data de lançamento: Informação não disponível.")

    else:
        print("Erro: Não foi possível acessar o site indicado.")
        result = {}

    game_info_json = json.dumps(result, ensure_ascii=False, indent=4)

    return game_info_json


def web_scrap_steam(url: str = 'https://store.steampowered.com/app/2322010/God_of_War_Ragnark/'):

    result = {}

    headers = {
        'Accept-Language': 'pt-BR',
    }

    response = requests.get(url, headers=headers)


    if response.status_code == 200:

        soup = BeautifulSoup(response.text, 'html.parser')

        img = soup.find('img', class_='game_header_image_full')
        img_src = img['src'] if img else None

        description = soup.find('div', class_='game_description_snippet').text.strip()

        users_summary_review = soup.find('div', class_='user_reviews_summary_row').text.replace('\n', '').replace('\t', '').replace('\r', '').strip()

        date = soup.find('div', class_='date').text

        developers = soup.find('div', id='developers_list').text.replace('\n', '')

        devs = soup.find_all('div', class_='dev_row')

        #print(distributors) # FALTA ID NA CLASSE

        popular_genders = soup.find('div', class_='glance_tags popular_tags').text.strip().replace('\t', '').replace('\n', '').replace('\r', ', ')

        categories = soup.find('div', class_='game_area_features_list_ctn').text

        #compatibility = soup.find('div', class_='_1CTHwmZmi5YE4kovZH_UIl')     # ESQUISITO

        price = soup.find('div', class_='game_purchase_price price').text.replace('\t', '').replace('\r', '').replace('\n', '')

        classification_age = soup.find('div', class_='game_rating_required_age').text.replace('\t', '').replace('\r', '').replace('\n', '')

        # Colocar gêneros reais: trabalhoso

        requiriments = soup.find('div', class_='game_area_sys_req sysreq_content active').text  # SEPARAR PARA AGREGAÇÃO

        #reviews = soup.find('div', id='Reviews_summary').text #SELENIUM, SETTAR FILTROS

        #FORMATAR
        result = {

            "img_src": img_src,

            "description": description,
        
            "users_sumary_review": users_summary_review,

            "date": date,

            "developers": developers,   #AGREGAR
            
            "popular_genders": popular_genders, #AGREGAR

            "categories": categories,   #AGREGAR

            "price": price,

            "classification_age": classification_age,

            "requiriments": requiriments    # AGREGAR 2x

        }
    
    else:
        result = {
            "Não foi possível acessar o site indicado": None
        }

    game_info_json = json.dumps(result, ensure_ascii=False, indent=4)

    return game_info_json

print("WEB SCRAP STEAM:")
print(web_scrap_steam())
print("\n\n\n")
print("WEB SCRAP AMAZON:")
print(web_scrap_amazon())