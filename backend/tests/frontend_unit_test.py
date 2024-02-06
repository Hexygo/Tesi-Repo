import time
from testcontainers.core.container import DockerContainer
from testcontainers.core import waiting_utils

import pytest
import re
from playwright.sync_api import Page, expect

import os

BASE_URL = 'http://localhost:3000'

@pytest.fixture
def start_container():
    with DockerContainer('tesi--frontend').with_bind_ports(3000,3000) as container:
        return container
    
def test_has_title(start_container,page:Page): # Controlla che la pagina sia stata deployata correttamente
    container = start_container.start()
    delay = waiting_utils.wait_for_logs(container, 'Accepting connections')

    page.goto(BASE_URL)
    expect(page).to_have_title(re.compile('Elliot Web'))

    container.stop()

def test_can_browse_navbar(start_container, page:Page): # Controlla il corretto funzionamento della navbar
    container = start_container.start()
    delay = waiting_utils.wait_for_logs(container, 'Accepting connections')

    page.goto("http://localhost:3000/")

    page.get_by_role("link", name="Data preprocessing").click()
    expect(page.get_by_role("main").get_by_text("Data preprocessing")).to_be_visible()
    page.get_by_role("link", name="Recommendation").click()
    expect(page.get_by_role("main").get_by_text("Recommendation", exact=True)).to_be_visible()
    page.get_by_role("link", name="Evaluation").click()
    expect(page.get_by_role("main").get_by_text("Evaluation", exact=True)).to_be_visible()

    container.stop()

def test_can_run_trough_form_preprocessing(start_container, page:Page): # Verifica il corretto funzionamento del form di upload del preprocessing
    container = start_container.start()
    delay = waiting_utils.wait_for_logs(container, 'Accepting connections')

    page.goto("http://localhost:3000/preprocessing")
    page.get_by_role("button", name="Start").click()
    page.get_by_role("button", name="Dataset").click()

    page.get_by_label("Random seed").click()
    page.get_by_label("Random seed").fill("42")
    page.get_by_label("Dataset binarization").check()
    page.get_by_label("Dataset binarization").uncheck()
    page.get_by_role("button", name="Next").click()

    page.get_by_label("User Average").check()
    page.get_by_role("button", name="Next").click()

    page.get_by_label("Random Subsampling").check()
    page.get_by_label("Test set ratio").click()
    page.get_by_label("Test set ratio").fill("0.2")
    page.get_by_role("button", name="Next").click()

    page.get_by_text("Random k-fold Cross Validation").click()
    page.get_by_label("Value of k").click()
    page.get_by_label("Value of k").fill("5")
    page.get_by_role("button", name="Next").click()

    page.locator("input").set_input_files(os.path.join(os.path.dirname(__file__), 'data', 'sample_dataset.tsv'))
    
    page.get_by_label("Reset input parameters").click()

    container.stop()

def test_can_run_trough_form_recommendation(start_container, page:Page): # Verifica il corretto funzionamento del form di upload della raccomandazione
    container = start_container.start()
    delay = waiting_utils.wait_for_logs(container, 'Accepting connections')

    page.goto("http://localhost:3000/recommendation")

    with page.expect_file_chooser() as fc_info: # Verifica che il form consenta l'upload di file
        page.get_by_text("Select a .tsv file").first.click()
    fc_info.value.set_files(os.path.join(os.path.dirname(__file__), 'data', 'sample_train.tsv'))
    with page.expect_file_chooser() as fc_info:
        page.get_by_text("Select a .tsv file").last.click()
    fc_info.value.set_files(os.path.join(os.path.dirname(__file__), 'data', 'sample_test.tsv'))

    page.get_by_text("Use top-k").check() # Verifica la funzionalità di topK
    expect(page.get_by_label("Value for k")).to_be_visible() 
    page.get_by_label("Value for k").click()
    page.get_by_label("Value for k").fill("15")
    page.get_by_label("Use top-k").uncheck()

    page.get_by_role("button", name="Add Model").click() # Controllo sulla funzionalità di aggiunta e rimozione dei modelli
    expect(page.get_by_test_id("model")).to_have_count(1)
    page.get_by_test_id("close").last.click()
    expect(page.get_by_test_id("model")).to_have_count(0)

    page.get_by_role("button", name="Add Model").click()
    page.locator("#loading_rec_model").nth(0).click()
    page.get_by_role("option", name="Unpersonalized Recommenders").click()
    page.locator("#loading_model").nth(0).click()
    page.get_by_role("option", name="MostPop").click()
    page.get_by_label("Validation metric").click()
    page.get_by_label("Validation metric").fill("nDCG")
    page.get_by_label("Validation rate").click()
    page.get_by_label("Validation rate").fill("10")

    page.get_by_role("button", name="Add Model").click()
    page.locator("#loading_rec_model").nth(1).click()
    page.get_by_role("option", name="Neighborhood-based Models").click()
    page.locator("#loading_model").nth(1).click()
    page.get_by_role("option", name="ItemKNN", exact=True).click()
    page.get_by_label("neighbors").click()
    page.get_by_label("neighbors").fill("50")
    page.get_by_label("similarity").click()
    page.get_by_label("similarity").fill("cosine")
    page.get_by_label("implementation").click()
    page.get_by_label("implementation").fill("standard")
    page.locator("#validation_metric").nth(1).click()
    page.locator("#validation_metric").nth(1).fill("nDCG")
    page.locator("#validation_rate").nth(1).click()
    page.locator("#validation_rate").nth(1).fill("10")

    page.get_by_role("button", name="Train models").click()
    #with page.expect_download() as download_info:
    #    page.get_by_role("link", name="questo link").click()
    #download = download_info.value

    container.stop()

def test_can_run_trough_form_evaluation(start_container, page:Page):
    container = start_container.start()
    delay = waiting_utils.wait_for_logs(container, 'Accepting connections')

    page.goto("http://127.0.0.1:3000/evaluation")

    page.get_by_role("button", name="start").click()

    with page.expect_file_chooser() as fc_info:
        page.get_by_text("Select a .tsv file").first.click()
    fc_info.value.set_files(os.path.join(os.path.dirname(__file__), 'data', 'sample_train.tsv'))
    with page.expect_file_chooser() as fc_info:
        page.get_by_text("Select a .tsv file").nth(1).click()
    fc_info.value.set_files(os.path.join(os.path.dirname(__file__), 'data', 'sample_test.tsv'))
    with page.expect_file_chooser() as fc_info:
        page.get_by_text("Select a .tsv file").last.click()
    fc_info.value.set_files(os.path.join(os.path.dirname(__file__), 'data', 'sample_recs.tsv'))
    page.get_by_role("button", name="Next").click()

    page.get_by_label("Relevance Treshold").click()
    page.get_by_label("Relevance Treshold").fill("1")
    page.get_by_label("Top K").click()
    page.get_by_label("Top K").fill("1")
    page.get_by_label("Paired tTest").check()
    page.get_by_label("Paired tTest").uncheck()
    page.get_by_label("Wilicoxon Test").check()
    page.get_by_label("Wilicoxon Test").uncheck()
    page.get_by_role("button", name="Next").click()

    page.get_by_role("button", name="Add Cutoffs").click()
    page.get_by_label("cutoff 1").click()
    page.get_by_label("cutoff 1").fill("1")
    page.get_by_role("button", name="Add Cutoffs").click()
    page.locator("li").filter(has_text="cutoff 2 *cutoff 2 *").get_by_role("button").click()
    page.get_by_text("Set a number of cutoffs Add").click()
    page.get_by_role("button", name="Next").click()

    page.get_by_label("AUC", exact=True).check()
    page.get_by_label("GAUC").check()
    page.get_by_label("GAUC").uncheck()
    page.get_by_role("button", name="Next").click()

    page.get_by_label("DSC").check()
    page.get_by_label("beta").click()
    page.get_by_label("beta").fill("1")
    page.get_by_label("ExtendedF1").check()
    page.get_by_label("DSC").uncheck()

    page.get_by_role("button", name="Evaluate with this options").click()

    container.stop()