/**
 * HOBBIX - Tabletop & Hobby Games Store
 * Dynamic Page Renderers, Recommendation Wizard & Filter Engines
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. HOME PAGE MODULES
     ========================================================================== */
  // Render New Arrivals on Home
  const homeNewArrivalsGrid = document.getElementById('home-new-arrivals-grid');
  if (homeNewArrivalsGrid) {
    const arrivals = STORE_DATA.products.slice(0, 8);
    homeNewArrivalsGrid.innerHTML = arrivals.map(createProductCardHTML).join('');
  }

  // Render Recommended by Player Count Tabs on Home
  const homePlayerTabs = document.querySelectorAll('.home-player-tab');
  const homeRecommendedGrid = document.getElementById('home-recommended-grid');
  if (homeRecommendedGrid && homePlayerTabs.length > 0) {
    const renderHomePlayerRecs = (bucket) => {
      const filtered = STORE_DATA.products.filter(p => p.playerBucket === bucket || bucket === 'all');
      homeRecommendedGrid.innerHTML = filtered.slice(0, 4).map(createProductCardHTML).join('');
    };

    renderHomePlayerRecs('1-2'); // Default

    homePlayerTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        homePlayerTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const bucket = tab.getAttribute('data-bucket');
        renderHomePlayerRecs(bucket);
      });
    });
  }

  // Render Community Game Nights on Home
  const homeEventsGrid = document.getElementById('home-events-grid');
  if (homeEventsGrid) {
    homeEventsGrid.innerHTML = STORE_DATA.events.slice(0, 3).map(createEventCardHTML).join('');
  }


  /* ==========================================================================
     2. HOME 2 PAGE MODULES (Curator's Showcase, Showdown & AI Oracle)
     ========================================================================== */

  // --- Hero Flagship Showcase Switcher ---
  const flagshipItems = [
    {
      id: "prod-2",
      title: "Dune: Imperium – Uprising",
      tagline: "Deck-Building & Political Worker Placement on Arrakis",
      bggRank: "#6 Worldwide",
      complexity: "3.2 / 5.0 (Tactical)",
      players: "1-4 Players",
      time: "60-120 Min",
      rating: 4.95,
      price: 64.99,
      originalPrice: 74.99,
      image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=900&q=80",
      quote: "“The sharpest tense political board game since Twilight Imperium.”",
      badge: "Game of the Year Nominee",
      accent: "var(--accent-gold)"
    },
    {
      id: "prod-1",
      title: "Frosthaven: Legends of the North",
      tagline: "Epic 100+ Hour Fantasy Dungeon Crawler Campaign",
      bggRank: "#3 Thematic",
      complexity: "4.3 / 5.0 (Heavy)",
      players: "1-4 Players",
      time: "90-180 Min",
      rating: 4.90,
      price: 159.99,
      originalPrice: 189.99,
      image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=900&q=80",
      quote: "“A breathtaking masterclass in tactical combat and world persistence.”",
      badge: "Staff Diamond Pick",
      accent: "var(--accent-cyan)"
    },
    {
      id: "prod-15",
      title: "Brass: Birmingham Deluxe",
      tagline: "The #1 Board Game in the World — Industrial Revolution Euro",
      bggRank: "#1 All-Time BGG",
      complexity: "3.9 / 5.0 (Mastermind)",
      players: "2-4 Players",
      time: "90-120 Min",
      rating: 4.98,
      price: 89.99,
      originalPrice: 99.99,
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=900&q=80",
      quote: "“Unrivaled economic depth. Every single turn is an agonizing puzzle.”",
      badge: "#1 Overall Ranked",
      accent: "var(--accent-orange)"
    },
    {
      id: "prod-3",
      title: "Wingspan: Collector's Edition",
      tagline: "Award-Winning Engine Building with Deluxe Wooden Dice Tower",
      bggRank: "Top 20 Strategy",
      complexity: "2.4 / 5.0 (Accessible)",
      players: "1-5 Players",
      time: "40-70 Min",
      rating: 4.85,
      price: 59.99,
      originalPrice: 69.99,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
      quote: "“The definitive tabletop centerpiece — relaxing, deep, and gorgeous.”",
      badge: "Spiel des Jahres Winner",
      accent: "var(--accent-emerald)"
    }
  ];

  window.selectHeroFlagship = function(index) {
    const item = flagshipItems[index];
    if (!item) return;

    // Update active tab buttons
    document.querySelectorAll('.flagship-tab-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    const display = document.getElementById('hero-flagship-display');
    if (!display) return;

    display.style.opacity = '0';
    display.style.transform = 'translateY(10px) scale(0.98)';

    setTimeout(() => {
      display.innerHTML = `
        <div class="flagship-card-inner">
          <div class="flagship-img-wrap">
            <img src="${item.image}" alt="${item.title}" class="flagship-img">
            <div class="flagship-gradient-overlay"></div>
            <span class="flagship-badge"><i class="fa-solid fa-crown"></i> ${item.badge}</span>
            <span class="flagship-rank-tag"><i class="fa-solid fa-trophy text-gold"></i> ${item.bggRank}</span>
          </div>

          <div class="flagship-info">
            <div class="flagship-header-row">
              <h3 class="flagship-title">${item.title}</h3>
              <div class="flagship-price-box">
                <span class="flagship-price">$${item.price.toFixed(2)}</span>
                <span class="flagship-orig-price">$${item.originalPrice.toFixed(2)}</span>
              </div>
            </div>
            <p class="flagship-tagline">${item.tagline}</p>
            <div class="flagship-quote"><i class="fa-solid fa-quote-left"></i> ${item.quote}</div>

            <div class="flagship-specs-grid">
              <div class="flagship-spec-chip">
                <i class="fa-solid fa-users text-gold"></i>
                <div>
                  <span class="spec-label">Players</span>
                  <strong>${item.players}</strong>
                </div>
              </div>
              <div class="flagship-spec-chip">
                <i class="fa-solid fa-clock text-gold"></i>
                <div>
                  <span class="spec-label">Duration</span>
                  <strong>${item.time}</strong>
                </div>
              </div>
              <div class="flagship-spec-chip">
                <i class="fa-solid fa-brain text-gold"></i>
                <div>
                  <span class="spec-label">Complexity</span>
                  <strong>${item.complexity}</strong>
                </div>
              </div>
              <div class="flagship-spec-chip">
                <i class="fa-solid fa-star text-gold"></i>
                <div>
                  <span class="spec-label">Rating</span>
                  <strong>${item.rating} ★★★★★</strong>
                </div>
              </div>
            </div>

            <div class="flagship-actions">
              <button class="btn btn-primary" onclick="AppState.addToCart('${item.id}')">
                <i class="fa-solid fa-cart-plus"></i> Add to Vault — $${item.price.toFixed(2)}
              </button>
              <button class="btn btn-secondary" onclick="openQuickView('${item.id}')">
                <i class="fa-solid fa-eye"></i> Quick View
              </button>
            </div>
          </div>
        </div>
      `;

      display.style.opacity = '1';
      display.style.transform = 'translateY(0) scale(1)';
    }, 180);
  };

  // Initialize Flagship if container exists
  if (document.getElementById('hero-flagship-display')) {
    selectHeroFlagship(0);
  }

  // --- Render Bestselling Hall of Fame Podium on Home 2 ---
  const home2BestsellersGrid = document.getElementById('home2-bestsellers-grid');
  
  window.filterHallOfFame = function(catKey = 'all') {
    if (!home2BestsellersGrid) return;

    // Update active filter pills
    document.querySelectorAll('.hof-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cat') === catKey);
    });

    let filtered = STORE_DATA.products.filter(p => p.bestseller || p.featured);
    if (catKey !== 'all') {
      filtered = filtered.filter(p => p.categoryKey === catKey);
    }
    if (filtered.length === 0) {
      filtered = STORE_DATA.products.filter(p => p.categoryKey === catKey);
    }
    const list = filtered.slice(0, 6);
    if (list.length === 0) return;

    const champ = list[0];
    const contenders = list.slice(1);

    const medals = [
      { class: 'rank-silver', icon: 'fa-medal', label: '2ND RANKED' },
      { class: 'rank-bronze', icon: 'fa-shield', label: '3RD RANKED' },
      { class: 'rank-default', icon: 'fa-circle-dot', label: '4TH RANKED' },
      { class: 'rank-default', icon: 'fa-circle-dot', label: '5TH RANKED' },
      { class: 'rank-default', icon: 'fa-circle-dot', label: '6TH RANKED' }
    ];

    home2BestsellersGrid.innerHTML = `
      <div class="hof-podium-stage">
        <!-- 🥇 Left Column: #1 Grand Champion Spotlight -->
        <div class="hof-grand-champion" onclick="openQuickView('${champ.id}')">
          <div class="hof-champ-badge">
            <i class="fa-solid fa-crown text-gold"></i>
            <span>#1 Grand Champion Masterpiece</span>
          </div>

          <div class="hof-champ-img-box">
            <img src="${champ.image}" alt="${champ.title}" class="hof-champ-img">
            <div class="hof-champ-gradient"></div>
            <span class="hof-champ-cat-tag"><i class="fa-solid fa-layer-group"></i> ${champ.category}</span>
            <span class="hof-champ-score-tag"><i class="fa-solid fa-star text-gold"></i> ${champ.rating} (${champ.reviews} reviews)</span>
          </div>

          <div class="hof-champ-body">
            <h3 class="hof-champ-title">${champ.title}</h3>
            <p class="hof-champ-desc">${champ.description}</p>

            <div class="hof-champ-specs-row">
              <div class="hof-champ-spec">
                <i class="fa-solid fa-users text-gold"></i>
                <span>${champ.players}</span>
              </div>
              <div class="hof-champ-spec">
                <i class="fa-solid fa-clock text-gold"></i>
                <span>${champ.time}</span>
              </div>
              <div class="hof-champ-spec">
                <i class="fa-solid fa-brain text-gold"></i>
                <span>${champ.difficulty} Level</span>
              </div>
              <div class="hof-champ-spec">
                <i class="fa-solid fa-child text-gold"></i>
                <span>Ages ${champ.age}</span>
              </div>
            </div>

            <div class="hof-champ-footer">
              <div class="hof-champ-price-box">
                <span class="hof-champ-price">$${champ.price.toFixed(2)}</span>
                ${champ.originalPrice ? `<span class="hof-champ-orig-price">$${champ.originalPrice.toFixed(2)}</span>` : ''}
              </div>
              <div class="hof-champ-actions">
                <button class="btn btn-primary" onclick="event.stopPropagation(); AppState.addToCart('${champ.id}')">
                  <i class="fa-solid fa-cart-plus"></i> Add #1 to Cart
                </button>
                <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); openQuickView('${champ.id}')">
                  <i class="fa-solid fa-eye"></i> Quick View
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 🥈🥉 Right Column: Ranked Contenders List (#2 to #6) -->
        <div class="hof-roster-list">
          ${contenders.map((prod, index) => {
            const medal = medals[index] || medals[3];
            const rankNum = index + 2;
            return `
              <div class="hof-roster-card ${medal.class}" onclick="openQuickView('${prod.id}')">
                <div class="hof-roster-rank ${medal.class}">
                  <i class="fa-solid ${medal.icon}"></i>
                  <span>#${rankNum}</span>
                </div>
                <div class="hof-roster-thumb-wrap">
                  <img src="${prod.image}" alt="${prod.title}" class="hof-roster-thumb" loading="lazy">
                </div>
                <div class="hof-roster-info">
                  <div class="hof-roster-title-row">
                    <h4>${prod.title}</h4>
                    <span class="hof-roster-cat">${prod.category}</span>
                  </div>
                  <div class="hof-roster-meta">
                    <span><i class="fa-solid fa-users text-gold"></i> ${prod.players}</span>
                    <span><i class="fa-solid fa-clock text-gold"></i> ${prod.time}</span>
                    <span><i class="fa-solid fa-star text-gold"></i> ${prod.rating}</span>
                  </div>
                </div>
                <div class="hof-roster-action-box">
                  <div class="hof-roster-price">$${prod.price.toFixed(2)}</div>
                  <button class="btn-add-cart" title="Add to Cart" onclick="event.stopPropagation(); AppState.addToCart('${prod.id}')">
                    <i class="fa-solid fa-cart-plus"></i>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  };

  if (home2BestsellersGrid) {
    filterHallOfFame('all');
  }

  // --- Head-to-Head Masterpiece Showdown Matrix ---
  const showdownData = [
    {
      id: "showdown-1",
      name: "Tactical Intrigue Showdown",
      subtitle: "Political Sci-Fi Deckbuilder vs Industrial Economic Powerhouse",
      gameA: {
        id: "prod-2",
        title: "Dune: Imperium – Uprising",
        category: "Sci-Fi Worker Placement",
        image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=600&q=80",
        price: "$64.99",
        strategyDepth: 90,
        themeImmersion: 95,
        replayability: 96,
        tablePresence: 88,
        idealFor: "Competitive groups that love bluffs, conflict & tense deck syngeries."
      },
      gameB: {
        id: "prod-15",
        title: "Brass: Birmingham Deluxe",
        category: "Historical Economic Euro",
        image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80",
        price: "$89.99",
        strategyDepth: 98,
        themeImmersion: 85,
        replayability: 94,
        tablePresence: 92,
        idealFor: "Deep thinkers who crave zero-luck economics & razor-sharp network building."
      },
      verdict: "Pick <strong>Dune: Imperium</strong> for high-stakes direct rivalry and betrayals; pick <strong>Brass: Birmingham</strong> for purest brain-burning economic mastery."
    },
    {
      id: "showdown-2",
      name: "Epic Cooperative Delves",
      subtitle: "Massive Frostbound Campaign vs Cosmic Eldritch Horror",
      gameA: {
        id: "prod-1",
        title: "Frosthaven: Legends of the North",
        category: "Fantasy Tactical Campaign",
        image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80",
        price: "$159.99",
        strategyDepth: 95,
        themeImmersion: 94,
        replayability: 99,
        tablePresence: 98,
        idealFor: "Dedicated game groups ready for a 100-hour tactical epic."
      },
      gameB: {
        id: "prod-4",
        title: "Arkham Horror: The LCG",
        category: "Cosmic Horror Deck Campaign",
        image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
        price: "$47.99",
        strategyDepth: 91,
        themeImmersion: 99,
        replayability: 95,
        tablePresence: 82,
        idealFor: "Pairs or solo investigators who value rich atmospheric narrative terror."
      },
      verdict: "Pick <strong>Frosthaven</strong> for immense board presence and outpost crafting; pick <strong>Arkham Horror LCG</strong> for chilling story depth and deck customization."
    },
    {
      id: "showdown-3",
      name: "Harmonious Nature Engines",
      subtitle: "Avian Engine Builder vs Pacific Northwest Habitat Drafter",
      gameA: {
        id: "prod-3",
        title: "Wingspan: Collector's Edition",
        category: "Engine Building Classic",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
        price: "$59.99",
        strategyDepth: 84,
        themeImmersion: 92,
        replayability: 90,
        tablePresence: 95,
        idealFor: "Medium strategy lovers and family nights with stunning components."
      },
      gameB: {
        id: "prod-6",
        title: "Cascadia: Pacific Wonders",
        category: "Spatial Tile Drafting",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
        price: "$34.99",
        strategyDepth: 80,
        themeImmersion: 88,
        replayability: 92,
        tablePresence: 86,
        idealFor: "Quick setup, accessible rules, and deeply satisfying spatial puzzles."
      },
      verdict: "Pick <strong>Wingspan</strong> for satisfying multi-card combo snowballing; pick <strong>Cascadia</strong> for relaxing, breezy 30-minute family drafting sessions."
    }
  ];

  window.selectShowdown = function(index) {
    const item = showdownData[index];
    if (!item) return;

    document.querySelectorAll('.showdown-tab-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    const container = document.getElementById('showdown-display-container');
    if (!container) return;

    container.innerHTML = `
      <div class="showdown-arena">
        <!-- Game A Card -->
        <div class="showdown-card">
          <div class="showdown-card-badge">Contender Alpha</div>
          <div class="showdown-card-hero">
            <img src="${item.gameA.image}" alt="${item.gameA.title}">
            <div class="showdown-card-hero-overlay">
              <span class="showdown-cat">${item.gameA.category}</span>
              <h4>${item.gameA.title}</h4>
              <span class="showdown-price-tag">${item.gameA.price}</span>
            </div>
          </div>
          <div class="showdown-metrics-list">
            <div class="metric-row">
              <div class="metric-label"><span>Strategic Depth</span><strong>${item.gameA.strategyDepth}%</strong></div>
              <div class="metric-bar"><div class="metric-fill" style="width: ${item.gameA.strategyDepth}%;"></div></div>
            </div>
            <div class="metric-row">
              <div class="metric-label"><span>Theme Immersion</span><strong>${item.gameA.themeImmersion}%</strong></div>
              <div class="metric-bar"><div class="metric-fill gold" style="width: ${item.gameA.themeImmersion}%;"></div></div>
            </div>
            <div class="metric-row">
              <div class="metric-label"><span>Replayability</span><strong>${item.gameA.replayability}%</strong></div>
              <div class="metric-bar"><div class="metric-fill cyan" style="width: ${item.gameA.replayability}%;"></div></div>
            </div>
            <div class="metric-row">
              <div class="metric-label"><span>Table Presence</span><strong>${item.gameA.tablePresence}%</strong></div>
              <div class="metric-bar"><div class="metric-fill purple" style="width: ${item.gameA.tablePresence}%;"></div></div>
            </div>
          </div>
          <div class="showdown-ideal-box">
            <i class="fa-solid fa-bullseye text-gold"></i>
            <p>${item.gameA.idealFor}</p>
          </div>
          <button class="btn btn-primary btn-sm" style="width:100%;" onclick="AppState.addToCart('${item.gameA.id}')">
            <i class="fa-solid fa-cart-plus"></i> Choose ${item.gameA.title.split(':')[0]}
          </button>
        </div>

        <!-- VS Center Badge -->
        <div class="showdown-vs-divider">
          <div class="showdown-vs-circle">VS</div>
          <div class="showdown-vs-pulse"></div>
        </div>

        <!-- Game B Card -->
        <div class="showdown-card">
          <div class="showdown-card-badge beta">Contender Beta</div>
          <div class="showdown-card-hero">
            <img src="${item.gameB.image}" alt="${item.gameB.title}">
            <div class="showdown-card-hero-overlay">
              <span class="showdown-cat">${item.gameB.category}</span>
              <h4>${item.gameB.title}</h4>
              <span class="showdown-price-tag">${item.gameB.price}</span>
            </div>
          </div>
          <div class="showdown-metrics-list">
            <div class="metric-row">
              <div class="metric-label"><span>Strategic Depth</span><strong>${item.gameB.strategyDepth}%</strong></div>
              <div class="metric-bar"><div class="metric-fill" style="width: ${item.gameB.strategyDepth}%;"></div></div>
            </div>
            <div class="metric-row">
              <div class="metric-label"><span>Theme Immersion</span><strong>${item.gameB.themeImmersion}%</strong></div>
              <div class="metric-bar"><div class="metric-fill gold" style="width: ${item.gameB.themeImmersion}%;"></div></div>
            </div>
            <div class="metric-row">
              <div class="metric-label"><span>Replayability</span><strong>${item.gameB.replayability}%</strong></div>
              <div class="metric-bar"><div class="metric-fill cyan" style="width: ${item.gameB.replayability}%;"></div></div>
            </div>
            <div class="metric-row">
              <div class="metric-label"><span>Table Presence</span><strong>${item.gameB.tablePresence}%</strong></div>
              <div class="metric-bar"><div class="metric-fill purple" style="width: ${item.gameB.tablePresence}%;"></div></div>
            </div>
          </div>
          <div class="showdown-ideal-box">
            <i class="fa-solid fa-bullseye text-gold"></i>
            <p>${item.gameB.idealFor}</p>
          </div>
          <button class="btn btn-primary btn-sm" style="width:100%;" onclick="AppState.addToCart('${item.gameB.id}')">
            <i class="fa-solid fa-cart-plus"></i> Choose ${item.gameB.title.split(':')[0]}
          </button>
        </div>
      </div>

      <!-- Verdict Banner -->
      <div class="showdown-verdict-box">
        <div class="verdict-icon"><i class="fa-solid fa-scale-balanced"></i></div>
        <div class="verdict-text">
          <h5>Curator's Match Verdict</h5>
          <p>${item.verdict}</p>
        </div>
      </div>
    `;
  };

  if (document.getElementById('showdown-display-container')) {
    selectShowdown(0);
  }

  // --- Enhanced Interactive AI Game Oracle Matchmaker (Home 2) ---
  const home2FinderBtn = document.getElementById('home2-finder-btn');
  const home2FinderResults = document.getElementById('home2-finder-results');
  if (home2FinderBtn && home2FinderResults) {
    const runFinder = () => {
      const playersVal = document.getElementById('finder-player-select').value;
      const ageVal = parseInt(document.getElementById('finder-age-select').value, 10);
      const styleVal = document.getElementById('finder-style-select').value;
      const timeVal = document.getElementById('finder-time-select') ? document.getElementById('finder-time-select').value : 'any';

      let matched = STORE_DATA.products.filter(prod => {
        const matchesPlayer = (playersVal === 'any') || (prod.playerBucket === playersVal);
        const matchesAge = (ageVal === 0) || (prod.ageNum <= ageVal);
        const matchesStyle = (styleVal === 'any') || (prod.categoryKey === styleVal);
        return matchesPlayer && matchesAge && matchesStyle;
      });

      // If no exact match, fallback to closest style or popular games
      if (matched.length === 0) {
        matched = STORE_DATA.products.filter(p => p.bestseller || p.featured).slice(0, 3);
        home2FinderResults.innerHTML = `
          <div class="finder-header-alert">
            <span class="badge badge-gold"><i class="fa-solid fa-wand-magic-sparkles"></i> Closest Top Recommendations (${matched.length} Games)</span>
            <span class="finder-tip">No 100% filter overlap, so our Vault AI pulled these acclaimed alternatives!</span>
          </div>
          <div class="products-grid">
            ${matched.map((p, i) => createProductCardHTML(p, 90 - i * 4)).join('')}
          </div>
        `;
      } else {
        home2FinderResults.innerHTML = `
          <div class="finder-header-alert">
            <span class="badge badge-gold"><i class="fa-solid fa-circle-check"></i> Found ${matched.length} Perfect Table Matches</span>
            <span class="finder-tip">Matched to your group size and gameplay preference</span>
          </div>
          <div class="products-grid">
            ${matched.slice(0, 4).map((p, i) => createProductCardHTML(p, 99 - i * 3)).join('')}
          </div>
        `;
      }
    };

    home2FinderBtn.addEventListener('click', runFinder);
    runFinder(); // Initial load
  }

  // Render Hobby & RPG Accessories on Home 2
  const home2AccessoriesGrid = document.getElementById('home2-accessories-grid');
  if (home2AccessoriesGrid) {
    const accs = STORE_DATA.products.filter(p => p.categoryKey === 'accessories' || p.categoryKey === 'rpg').slice(0, 4);
    home2AccessoriesGrid.innerHTML = accs.map(p => createProductCardHTML(p)).join('');
  }

  // Render Home 2 Events
  const home2EventsGrid = document.getElementById('home2-events-grid');
  if (home2EventsGrid) {
    home2EventsGrid.innerHTML = STORE_DATA.events.slice(0, 3).map(createEventCardHTML).join('');
  }


  /* ==========================================================================
     3. PRODUCTS PAGE MODULES (Live Dynamic Multi-Filter & Sorting)
     ========================================================================== */
  const productsGridContainer = document.getElementById('products-listing-grid');
  const productsCountLabel = document.getElementById('products-count-label');
  const priceRangeInput = document.getElementById('price-range-slider');
  const priceRangeValLabel = document.getElementById('price-range-value');
  const sortSelect = document.getElementById('products-sort-select');

  if (productsGridContainer) {
    let currentCategory = 'all';

    const filterAndRenderProducts = () => {
      const maxPrice = priceRangeInput ? parseFloat(priceRangeInput.value) : 200;
      if (priceRangeValLabel) priceRangeValLabel.textContent = `$${maxPrice}`;

      // Selected Player Filters
      const playerCheckboxes = document.querySelectorAll('.filter-player-checkbox:checked');
      const selectedPlayerBuckets = Array.from(playerCheckboxes).map(cb => cb.value);

      // Selected Age Filters
      const ageCheckboxes = document.querySelectorAll('.filter-age-checkbox:checked');
      const selectedAges = Array.from(ageCheckboxes).map(cb => parseInt(cb.value, 10));

      // Selected Difficulty Filters
      const diffCheckboxes = document.querySelectorAll('.filter-diff-checkbox:checked');
      const selectedDiffs = Array.from(diffCheckboxes).map(cb => cb.value);

      // In Stock Only Filter
      const inStockOnly = document.getElementById('filter-in-stock')?.checked;

      // Filtering Logic
      let filtered = STORE_DATA.products.filter(prod => {
        // Category
        if (currentCategory !== 'all' && prod.categoryKey !== currentCategory) return false;
        // Price
        if (prod.price > maxPrice) return false;
        // Player Count
        if (selectedPlayerBuckets.length > 0 && !selectedPlayerBuckets.includes(prod.playerBucket)) return false;
        // Age
        if (selectedAges.length > 0 && !selectedAges.some(age => prod.ageNum <= age)) return false;
        // Difficulty
        if (selectedDiffs.length > 0 && !selectedDiffs.includes(prod.difficulty)) return false;
        // In Stock
        if (inStockOnly && !prod.inStock) return false;

        return true;
      });

      // Sorting Logic
      const sortVal = sortSelect ? sortSelect.value : 'featured';
      if (sortVal === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortVal === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortVal === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (sortVal === 'newest') {
        filtered.reverse();
      }

      // Render
      if (productsCountLabel) {
        productsCountLabel.textContent = `Showing ${filtered.length} of ${STORE_DATA.products.length} Tabletop Games`;
      }

      if (filtered.length === 0) {
        productsGridContainer.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--glass-border);">
            <i class="fa-solid fa-ghost" style="font-size: 3rem; color: var(--accent-gold); margin-bottom: 1rem; opacity: 0.7;"></i>
            <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">No Tabletop Games Found</h3>
            <p style="margin-bottom: 1.5rem;">Try resetting your filters or adjusting your price slider.</p>
            <button class="btn btn-primary btn-sm" id="reset-all-filters-btn">Reset All Filters</button>
          </div>
        `;
        document.getElementById('reset-all-filters-btn')?.addEventListener('click', resetFilters);
      } else {
        productsGridContainer.innerHTML = filtered.map(createProductCardHTML).join('');
      }
    };

    const resetFilters = () => {
      currentCategory = 'all';
      document.querySelectorAll('.cat-pill-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.cat-pill-btn[data-category="all"]')?.classList.add('active');
      document.querySelectorAll('.filter-checkbox-label input').forEach(cb => cb.checked = false);
      if (priceRangeInput) priceRangeInput.value = 200;
      if (sortSelect) sortSelect.value = 'featured';
      filterAndRenderProducts();
    };

    // Category Pill Buttons
    document.querySelectorAll('.cat-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        filterAndRenderProducts();
      });
    });

    // Checkbox and Slider Listeners
    document.querySelectorAll('.filter-checkbox-label input').forEach(input => {
      input.addEventListener('change', filterAndRenderProducts);
    });

    priceRangeInput?.addEventListener('input', filterAndRenderProducts);
    sortSelect?.addEventListener('change', filterAndRenderProducts);
    document.getElementById('clear-filters-sidebar-btn')?.addEventListener('click', resetFilters);

    // Initial render
    filterAndRenderProducts();
  }


  /* ==========================================================================
     4. RECOMMENDATIONS PAGE MODULES (Interactive Help Me Choose Tool)
     ========================================================================== */
  const wizardContainer = document.getElementById('recommendation-wizard');
  if (wizardContainer) {
    let currentStep = 1;
    const userSelections = {
      players: '2',
      audience: 'family',
      style: 'strategy'
    };

    const step1El = document.getElementById('wizard-step-1');
    const step2El = document.getElementById('wizard-step-2');
    const step3El = document.getElementById('wizard-step-3');
    const resultsEl = document.getElementById('wizard-results-container');
    const matchedGrid = document.getElementById('wizard-matched-games-grid');

    const updateStepIndicators = () => {
      document.querySelectorAll('.wizard-step-node').forEach(node => {
        const stepNum = parseInt(node.getAttribute('data-step'), 10);
        if (stepNum <= currentStep) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });
    };

    const showStep = (step) => {
      currentStep = step;
      updateStepIndicators();
      step1El.style.display = (step === 1) ? 'block' : 'none';
      step2El.style.display = (step === 2) ? 'block' : 'none';
      step3El.style.display = (step === 3) ? 'block' : 'none';
      resultsEl.style.display = (step === 4) ? 'block' : 'none';

      if (step === 4) {
        generateWizardMatches();
      }
    };

    // Option cards selection
    document.querySelectorAll('.wizard-option-card').forEach(card => {
      card.addEventListener('click', () => {
        const parent = card.closest('.wizard-options-grid');
        parent.querySelectorAll('.wizard-option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        const type = card.getAttribute('data-type');
        const val = card.getAttribute('data-value');
        userSelections[type] = val;
      });
    });

    // Navigation buttons
    document.getElementById('wizard-step1-next')?.addEventListener('click', () => showStep(2));
    document.getElementById('wizard-step2-prev')?.addEventListener('click', () => showStep(1));
    document.getElementById('wizard-step2-next')?.addEventListener('click', () => showStep(3));
    document.getElementById('wizard-step3-prev')?.addEventListener('click', () => showStep(2));
    document.getElementById('wizard-step3-submit')?.addEventListener('click', () => showStep(4));
    document.getElementById('wizard-restart-btn')?.addEventListener('click', () => {
      showStep(1);
    });

    const generateWizardMatches = () => {
      // Calculate dynamic match scores
      const scoredProducts = STORE_DATA.products.map(prod => {
        let score = 70; // baseline
        if (userSelections.players === prod.playerBucket) score += 15;
        if (userSelections.style === prod.categoryKey) score += 12;
        if (prod.rating >= 4.9) score += 3;
        const matchPct = Math.min(99, score);
        return { ...prod, matchPct };
      });

      scoredProducts.sort((a, b) => b.matchPct - a.matchPct);
      const top3 = scoredProducts.slice(0, 3);

      matchedGrid.innerHTML = top3.map(prod => `
        <div style="position: relative;">
          <div class="match-percentage-badge">
            <i class="fa-solid fa-wand-magic-sparkles"></i> ${prod.matchPct}% Match
          </div>
          ${createProductCardHTML(prod)}
        </div>
      `).join('');
    };

    showStep(1); // Start on step 1
  }

  // Recommendations Tabbed Category Showcase
  const recTabBtns = document.querySelectorAll('.rec-tab-btn');
  const recShowcaseGrid = document.getElementById('rec-showcase-grid');
  if (recShowcaseGrid && recTabBtns.length > 0) {
    const renderRecShowcase = (type) => {
      let filtered = [];
      if (type === 'couples') filtered = STORE_DATA.products.filter(p => p.playerBucket === '1-2');
      else if (type === 'party') filtered = STORE_DATA.products.filter(p => p.playerBucket === '5+');
      else if (type === 'heavy') filtered = STORE_DATA.products.filter(p => p.difficulty === 'Expert');
      else filtered = STORE_DATA.products.filter(p => p.categoryKey === 'family');

      recShowcaseGrid.innerHTML = filtered.slice(0, 4).map(createProductCardHTML).join('');
    };

    renderRecShowcase('couples');

    recTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        recTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderRecShowcase(btn.getAttribute('data-type'));
      });
    });
  }


  /* ==========================================================================
     5. BLOG PAGE MODULES
     ========================================================================== */
  const blogArticlesGrid = document.getElementById('blog-articles-grid');
  const blogCategoryFilterBtns = document.querySelectorAll('.blog-cat-btn');

  if (blogArticlesGrid) {
    const renderArticles = (category = 'all') => {
      const filtered = category === 'all' 
        ? STORE_DATA.articles 
        : STORE_DATA.articles.filter(a => a.category.toLowerCase().includes(category.toLowerCase()));
      blogArticlesGrid.innerHTML = filtered.map(createArticleCardHTML).join('');
    };

    renderArticles('all');

    blogCategoryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        blogCategoryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderArticles(btn.getAttribute('data-cat'));
      });
    });
  }

  const blogEventsGrid = document.getElementById('blog-events-grid');
  if (blogEventsGrid) {
    blogEventsGrid.innerHTML = STORE_DATA.events.slice(0, 3).map(createEventCardHTML).join('');
  }


  /* ==========================================================================
     6. CONTACT PAGE MODULES (Forms Validation & FAQ Accordion)
     ========================================================================== */
  // General Contact Form Validation
  const contactForm = document.getElementById('main-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameField = document.getElementById('contact-name');
      const emailField = document.getElementById('contact-email');
      const msgField = document.getElementById('contact-message');

      // Simple validation helper
      const validateField = (field, condition) => {
        const group = field.closest('.form-group');
        if (!condition) {
          group.classList.add('has-error');
          isValid = false;
        } else {
          group.classList.remove('has-error');
        }
      };

      validateField(nameField, nameField.value.trim().length >= 2);
      validateField(emailField, emailField.value.includes('@') && emailField.value.includes('.'));
      validateField(msgField, msgField.value.trim().length >= 10);

      if (isValid) {
        showToast(`Thank you, ${nameField.value.trim()}! Your message has been sent to our Game Masters.`, 'success');
        contactForm.reset();
      }
    });
  }

  // Club & Bulk Order Enquiry Form Validation
  const bulkOrderForm = document.getElementById('bulk-order-form');
  if (bulkOrderForm) {
    bulkOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const orgField = document.getElementById('bulk-org-name');
      const contactField = document.getElementById('bulk-contact-person');
      const emailField = document.getElementById('bulk-email');
      const sizeField = document.getElementById('bulk-size');

      const validateField = (field, condition) => {
        const group = field.closest('.form-group');
        if (!condition) {
          group.classList.add('has-error');
          isValid = false;
        } else {
          group.classList.remove('has-error');
        }
      };

      validateField(orgField, orgField.value.trim().length >= 2);
      validateField(contactField, contactField.value.trim().length >= 2);
      validateField(emailField, emailField.value.includes('@'));
      validateField(sizeField, sizeField.value.trim().length >= 1);

      if (isValid) {
        showToast(`Bulk order inquiry submitted for "${orgField.value.trim()}". A tabletop concierge will respond within 24 hours.`, 'success');
        bulkOrderForm.reset();
      }
    });
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     7. BLOG DETAIL PAGE MODULE (Dynamic Multi-Article Renderer)
     ========================================================================== */
  const blogDetailHero = document.getElementById('blog-detail-hero');
  if (blogDetailHero) {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id') || 'art-1';
    const article = STORE_DATA.articles.find(a => a.id === articleId) || STORE_DATA.articles[0];

    // 1. Update Title & Meta
    document.title = `${article.title} | Hobbix Tabletop Chronicle`;

    // 2. Render Hero Header
    const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = article.title.length > 35 ? article.title.substring(0, 32) + '...' : article.title;

    const heroSectionHeader = blogDetailHero.querySelector('.section-header');
    if (heroSectionHeader) {
      heroSectionHeader.innerHTML = `
        <div style="display: flex; justify-content: center; gap: 0.75rem; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap;">
          <span class="badge badge-gold"><i class="fa-solid fa-crown"></i> ${article.category}</span>
          <span class="badge badge-purple"><i class="fa-solid fa-chess"></i> Strategic Chronicle</span>
          <span style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-muted);"><i class="fa-regular fa-clock"></i> ${article.readTime}</span>
        </div>
        <h1 class="section-title" style="font-size: clamp(1.8rem, 3.8vw, 2.75rem); line-height: 1.2; margin-bottom: 1rem;">
          ${article.title}
        </h1>
        <p class="section-subtitle" style="font-size: 1rem; color: var(--text-secondary); max-width: 720px; line-height: 1.65; margin: 0 auto 1.5rem;">
          ${article.excerpt}
        </p>
        <div class="blog-author-header-chip" style="display: inline-flex; align-items: center; gap: 0.85rem; background: var(--bg-surface); padding: 0.4rem 1.25rem 0.4rem 0.5rem; border-radius: var(--radius-full); border: 1px solid var(--glass-border);">
          <img src="${article.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'}" alt="${article.author}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
          <span style="font-size: 0.88rem; color: var(--text-primary); font-weight: 600;">By ${article.author}</span>
          <span style="font-size: 0.8rem; color: var(--text-dim);">&bull; ${article.date}</span>
        </div>
      `;
    }

    // 3. Render Main Article Content
    const articleContainer = document.querySelector('.blog-article-content');
    if (articleContainer) {
      const specCardHTML = article.specCard ? `
        <div class="blog-game-spec-card">
          <div class="game-spec-header">
            <div class="game-spec-title-wrap">
              <span class="badge badge-gold">${article.specCard.badge}</span>
              <h3>${article.specCard.title}</h3>
            </div>
            <div class="game-spec-rating">
              <i class="fa-solid fa-star text-gold"></i>
              <strong>${article.specCard.rating}</strong><span>/10</span>
            </div>
          </div>
          <div class="game-spec-grid">
            <div class="spec-item">
              <span class="spec-label">Weight / Complexity</span>
              <span class="spec-val text-gold"><i class="fa-solid fa-brain"></i> ${article.specCard.weight}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Player Count</span>
              <span class="spec-val"><i class="fa-solid fa-users"></i> ${article.specCard.players}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Play Time</span>
              <span class="spec-val"><i class="fa-regular fa-clock"></i> ${article.specCard.time}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Core Mechanics</span>
              <span class="spec-val"><i class="fa-solid fa-network-wired"></i> ${article.specCard.mechanics}</span>
            </div>
          </div>
          <div class="game-spec-pros-cons">
            <div class="spec-pros">
              <strong><i class="fa-solid fa-circle-check text-emerald"></i> Why We Love It:</strong>
              <ul>
                ${article.specCard.pros.map(p => `<li>${p}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      ` : '';

      const secondaryImagesHTML = article.secondaryImages && article.secondaryImages.length ? `
        <div class="blog-inline-image-grid">
          ${article.secondaryImages.map(img => `
            <div class="inline-img-box">
              <img src="${img.src}" alt="${img.tag}" class="inline-img">
              <span class="inline-img-tag">${img.tag}</span>
            </div>
          `).join('')}
        </div>
      ` : '';

      const tacticsHTML = article.tactics && article.tactics.length ? `
        <div class="blog-prose-block" id="prose-tactics">
          <h2>Masterclass: 4 Golden Rules for Tabletop Mastery</h2>
          <div class="blog-tactics-list">
            ${article.tactics.map(t => `
              <div class="tactic-card">
                <span class="tactic-num">${t.num}</span>
                <div>
                  <h4>${t.title}</h4>
                  <p>${t.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : '';

      const tagsHTML = article.tags ? article.tags.map(tag => `<span class="tag-pill"><i class="fa-solid fa-tag"></i> #${tag}</span>`).join('') : '';

      articleContainer.innerHTML = `
        <div class="blog-lead-figure">
          <img src="${article.image}" alt="${article.title}" class="blog-lead-img">
          <figcaption class="blog-lead-caption">
            <i class="fa-solid fa-camera text-gold"></i> ${article.caption || article.title}
          </figcaption>
        </div>

        <div class="blog-prose-block" id="prose-intro">
          <h2>The Strategic Blueprint & Core Principles</h2>
          <p>${article.leadProse}</p>
          <p>${article.excerpt}</p>

          <blockquote class="blog-pull-quote">
            <div class="pull-quote-icon"><i class="fa-solid fa-quote-left"></i></div>
            <p>"${article.pullQuote.quote}"</p>
            <cite>&mdash; ${article.pullQuote.cite}</cite>
          </blockquote>
        </div>

        <div class="blog-prose-block" id="prose-deep-dive">
          <h2>Deep Dive & Showcase Analysis</h2>
          <p>Whether introducing newcomers or dueling with veteran strategists, understanding the underlying tempo and action economy transforms how your table experiences the game.</p>
          ${specCardHTML}
          ${secondaryImagesHTML}
        </div>

        ${tacticsHTML}

        <div class="blog-share-footer-bar">
          <div class="blog-tag-cloud">
            ${tagsHTML}
          </div>
          <div class="blog-share-buttons">
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">Share Article:</span>
            <button class="share-btn" onclick="showToast('Article link copied to clipboard!', 'success')" title="Copy Link"><i class="fa-solid fa-link"></i></button>
            <button class="share-btn" onclick="showToast('Opening Twitter / X share...', 'info')" title="Share on X"><i class="fa-brands fa-x-twitter"></i></button>
            <button class="share-btn" onclick="showToast('Opening Reddit share...', 'info')" title="Share on Reddit"><i class="fa-brands fa-reddit-alien"></i></button>
          </div>
        </div>
      `;
    }

    // 4. Render Sticky Sidebar Featured Products
    const sidebarProductsContainer = document.querySelector('.featured-products-widget');
    if (sidebarProductsContainer && article.featuredProducts) {
      const prods = article.featuredProducts.map(pId => STORE_DATA.products.find(p => p.id === pId)).filter(Boolean);
      sidebarProductsContainer.innerHTML = `
        <h4 class="widget-title"><i class="fa-solid fa-cart-shopping text-gold"></i> Featured Games</h4>
        ${prods.map(prod => `
          <div class="sidebar-product-card" style="margin-bottom: 0.75rem;">
            <img src="${prod.image}" alt="${prod.title}" class="sidebar-prod-img">
            <div class="sidebar-prod-info">
              <h5>${prod.title}</h5>
              <span class="sidebar-prod-price">$${prod.price.toFixed(2)}</span>
              <button class="btn btn-primary btn-sm" onclick="AppState.addToCart('${prod.id}'); showToast('Added ${prod.title.replace(/'/g, "\\'")} to Cart!', 'success')">
                <i class="fa-solid fa-cart-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        `).join('')}
      `;
    }

    // 5. Render Author Spotlight in Section 3
    const authorCardContainer = document.querySelector('.blog-author-full-card');
    if (authorCardContainer) {
      authorCardContainer.innerHTML = `
        <div class="author-avatar-col">
          <img src="${article.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}" alt="${article.author}" class="author-avatar-large">
          <span class="badge badge-gold" style="margin-top: 0.75rem;"><i class="fa-solid fa-crown"></i> Senior Curator</span>
        </div>
        <div class="author-bio-col">
          <div class="author-meta-header">
            <div>
              <h3 class="author-full-name">${article.author}</h3>
              <span class="author-title-tag">${article.authorRole}</span>
            </div>
            <div class="author-social-links">
              <a href="https://twitter.com" class="author-social-btn" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
              <a href="https://boardgamegeek.com" class="author-social-btn" aria-label="BGG"><i class="fa-solid fa-dice"></i></a>
              <a href="contact.html" class="author-social-btn" aria-label="Message"><i class="fa-solid fa-envelope"></i></a>
            </div>
          </div>
          <p class="author-bio-text">${article.authorBio}</p>
          <div class="author-favorite-strip">
            <span>${article.author}'s Top Recommendations:</span>
            <strong>${article.authorFavs}</strong>
          </div>
        </div>
      `;
    }

    // 6. Render Discussion Comments in Section 4
    const commentsListContainer = document.querySelector('.comments-thread-list');
    const discussionTitle = document.querySelector('#blog-discussion .section-title');
    if (commentsListContainer && article.comments) {
      if (discussionTitle) discussionTitle.innerHTML = `Community <span class="text-gold">Discussion</span> (${article.comments.length})`;
      commentsListContainer.innerHTML = article.comments.map(c => `
        <div class="comment-card ${c.isStaff ? 'comment-reply' : ''}">
          <div class="comment-header">
            <div class="comment-author-info">
              <div class="comment-avatar ${c.isStaff ? 'gm-avatar' : ''}"><i class="fa-solid ${c.isStaff ? 'fa-dice-d20' : 'fa-user'}"></i></div>
              <div>
                <h4 class="comment-author-name">${c.name} <span class="badge ${c.isStaff ? 'badge-gold' : 'badge-purple'}" style="font-size: 0.65rem;">${c.badge}</span></h4>
                <span class="comment-date">${c.date}</span>
              </div>
            </div>
            ${c.stars ? `
              <div class="comment-rating-stars">
                ${Array.from({ length: c.stars }).map(() => '<i class="fa-solid fa-star text-gold"></i>').join('')}
              </div>
            ` : ''}
          </div>
          <p class="comment-text">${c.text}</p>
          <div class="comment-actions-bar">
            <button class="comment-action-btn" onclick="showToast('Thanks for your upvote!', 'success')"><i class="fa-solid fa-thumbs-up"></i> Helpful</button>
            <button class="comment-action-btn" onclick="showToast('Reply thread opened.', 'info')"><i class="fa-solid fa-reply"></i> Reply</button>
          </div>
        </div>
      `).join('');
    }

    // 7. Render Related Chronicles Grid in Section 5
    const relatedArticlesGrid = document.querySelector('#blog-related-articles .articles-grid');
    if (relatedArticlesGrid) {
      const otherArticles = STORE_DATA.articles.filter(a => a.id !== article.id).slice(0, 3);
      relatedArticlesGrid.innerHTML = otherArticles.map(createArticleCardHTML).join('');
    }
  }

});
