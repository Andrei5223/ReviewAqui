import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager  # para gerenciar o driver
from selenium.webdriver.common.by import By
import time
import json

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

        # CONFLITO
        #classification_age = soup.find('div', class_='game_rating_required_age').text.replace('\t', '').replace('\r', '').replace('\n', '')

        # Colocar gêneros reais: trabalhoso

        requiriments = soup.find('div', class_='game_area_sys_req sysreq_content active').text  # SEPARAR PARA AGREGAÇÃO

        #print(soup.find('div', class_='game_area_sys_req sysreq_content active'))

        driver.get(url)

        driver.implicitly_wait(0)

        scroll_to_bottom()

        comments = driver.find_elements(By.ID, 'Reviews_summary')

        for comment in comments:
           print(comment.text)

        driver.quit()

        #print(soup.find('div', id='user_reviews_filter_score'))

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

            #"classification_age": classification_age,

            "requiriments": requiriments    # AGREGAR 2x

        }
    
    else:
        result = {
            "Não foi possível acessar o site indicado": None
        }

    game_info_json = json.dumps(result, ensure_ascii=False, indent=4)

    return game_info_json

web_scrap_steam()