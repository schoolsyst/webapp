from helium import *
from behave import given, when, then
from dotenv import load_dotenv
from os import getenv, path
load_dotenv(path.join(path.dirname(__file__), '.env'))

@given("that the user is logged in")
def step_impl(ctx):
  start_chrome("https://app.schoolsyst.com/")
  write(getenv("SCHOOLSYST_USERNAME"), into="Nom")
  write(getenv("SCHOOLSYST_PASSWORD"), into="Mot de passe")
  click(Button("Connexion"))
  wait_until(Text("Projet open source").exists)

@given("that the user is on the homework page")
def step_impl(ctx):
  go_to(f"app.schoolsyst.com/homework")
  wait_until(Text("Voir les exercices complétés").exists)

@given("that there are homework items on the page")
def step_impl(ctx):
  assert not Text("Bravo. Vous n'avez plus rien à travailler, pour le moment.").exists()

@when("the user clicks on an item")
def step_impl(ctx):
  click(S('ul.homework li'))

@then("a homework details modal opens")
def step_impl(ctx):
  assert 'opened' in S('aside#modal_add-homework').web_element.get_attribute('class').split(' ')
