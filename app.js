/* global $ instantsearch algoliasearch */

const autocomplete = instantsearch.connectors.connectAutocomplete(
  ({ indices, refine, widgetParams }, isFirstRendering) => {
    const { container } = widgetParams;

    if (isFirstRendering) {
      const acElem = document.createElement("div");
      acElem.id = 'ais-autocomplete';
      container.appendChild(acElem);
      return;
    }

    let newResults = '';

    indices.forEach(index => {
      if (index.hits.length) {
        newResults += `
          <div class="result-section ${index.indexName}">
          <h4>Results for ${index.indexName}</h4>
        `
        index.hits.forEach(hit => {
            newResults += `
              <div class="hit">
                <div class="image"><img src="${hit.image}" /></div>
                <div class="name">${instantsearch.highlight({ attribute: 'name', hit })}</div>
              </div>
            `
          }
        );
        newResults += '</div>'
      }
    });

    document.getElementById("ais-autocomplete").innerHTML = newResults;
  }
);

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const search = instantsearch({
  indexName: 'instant_search',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),

  instantsearch.widgets.index({ indexName: 'instant_search_price_desc' }),

  instantsearch.widgets.configure({
    hitsPerPage: 3,
  }),

  autocomplete({
    container: document.getElementById('autocomplete'),
  }),
]);

search.start();
