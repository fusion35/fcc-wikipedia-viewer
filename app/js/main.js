(function() {
  let btnRandom = document.getElementById('btn-random');
  btnRandom.addEventListener("click", () => {
    let url = btnRandom.dataset.url;
    let selectedLang =  document.querySelector('#lang-selector-container .selected-lang').textContent.toLowerCase();
    url = url.replace('[LANG]',selectedLang);
    window.open(url);
  }, false);

  let searchInput = document.querySelector('.search-input .search');
  searchInput.addEventListener('focusin', () => {
    searchInput.classList.contains('empty') ? searchInput.classList.remove('empty') : '';
  }, false);

  let btnSearch = document.querySelector('.btn-search');
  btnSearch.addEventListener("click", () => {
    if (searchText() == '') {
      searchInput.classList.add('empty');
    }
    else {
      toggleElementClass(document.querySelector('.spinner'), 'hide');
      WikipediaViewerModule.populateSearchResult();
    }
  }, false);

  let btnRedo = document.querySelector('.btn-redo');
  btnRedo.addEventListener("click", () => {
    searchInput.value = '';
    searchInput.focus();
    toggleElementClass(document.querySelector('#no-result'), 'hide');
  }, false);

 let langSelector = document.querySelector('#lang-selector-container .selector');
 if (langSelector) {
   langSelector.addEventListener('click', () => {
     let langMask = document.querySelector('#lang-selector-container .list-container');
     let langList = document.querySelector('#lang-selector-container .list');
     let selectedLang =  document.querySelector('#lang-selector-container .selected-lang').innerText;
     toggleElementClass(langMask, 'hide');
   }, false);
 }

 let langList = document.querySelector('#lang-selector-container .list');
 if (langList) {
     langList.addEventListener('click', (e) => {
     let selectedLang =  document.querySelector('#lang-selector-container .selected-lang');
     let langMask = document.querySelector('#lang-selector-container .list-container');
     selectedLang.textContent = e.target.textContent;
     toggleElementClass(langMask, 'hide');
   }, false);
 }

})();

function toggleElementClass(element, cls) {
  if (element) {
    element.classList.contains(cls) ? element.classList.remove(cls) : element.classList.add(cls);
  }
}

function searchText() {
  return document.querySelector('.search-input .search').value;
}

var WikipediaViewerModule = (function() {
  function _get(url) {
    const CORS_ANYWHERE_URL = "https://cors-anywhere.herokuapp.com/";
    return new Promise( (resolve, reject) => {
      let req = new XMLHttpRequest();
      req.open('GET', `${CORS_ANYWHERE_URL}${url}`);
      req.onload = () => {
        if (req.status == 200) {
          resolve(req.response);
        }
        else {
          reject(Error(req.statusText));
        }
      };
      req.onError = () => {
        reject(Error('Network Error'));
      };
      req.send();
    });
  }

  function _selectedLang() {
    return document.querySelector('#lang-selector-container .selected-lang').textContent.toLowerCase();
  }

  function _searchURL() {
    return `https://${_selectedLang()}.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrlimit=20&prop=info|pageimages|extracts&inprop=url&exlimit=max&pilimit=max&pithumbsize=400&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=${searchText()}`;
  }

  function _getJSON() {
    return _get(_searchURL()).then(JSON.parse)
  }

  function _searchResult() {
    let resultContainer = document.querySelector('#search-results');
    resultContainer.innerHTML = '';
    let noResult = document.querySelector('#no-result');
    (!noResult.classList.contains('hide'))?noResult.classList.add('hide'):'';
    _getJSON().then(data => {
      if (data && data.query && data.query.pages) {
        let pages = data.query.pages;
        let result = '';
        Object.values(pages).map(page => {
          result += `<div class="result">
                        <a href="${(page.fullurl?page.fullurl:'#')}" target="_blank">
                          <h4>${(page.title?page.title:'')}</h4>
                        </a>
                        <img src="${(page.thumbnail && page.thumbnail.source?page.thumbnail.source:'images/Wikipedia-logo-v2.png')}" width="${(page.thumbnail && page.thumbnail.width?page.thumbnail.width:'0')}" height="${(page.thumbnail && page.thumbnail.height?page.thumbnail.height:'')}">
                        <p>${(page.extract?page.extract:'')}</p>
                     </div>`;
        });
        resultContainer.innerHTML = result;
      }
      else {
        let noResult = document.querySelector('#no-result');
        noResult.querySelector('h3>span').innerHTML = searchText();
        toggleElementClass(noResult, 'hide');
      }
      toggleElementClass(document.querySelector('.spinner'), 'hide');
    });
  }

  return {
    getJSON: () => {return _getJSON()},
    populateSearchResult: () => {return _searchResult()}
  }
})();
