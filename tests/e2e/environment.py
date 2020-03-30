from dotenv import load_dotenv
from os import getenv, path
load_dotenv(path.join(path.dirname(__file__), '.env'))
from helium import *
from behave import fixture, use_fixture


# go_to("app.schoolsyst.com/homework")
# wait_until(Text("Voir les exercices complétés").exists)
# click(S('ul.homework li'))
# assert 'opened' in S('aside#modal_add-homework').web_element.get_attribute('class').split(' ')
# click(S('button.close-modal'))
# assert 'opened' not in S('aside#modal_add-homework').web_element.get_attribute('class').split(' ')
