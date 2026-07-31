const searchForm = document.getElementById('searchForm');
					const searchToggleBtn = document.getElementById('searchToggleBtn');
					const searchInput = document.getElementById('searchInput');
					const searchText = document.getElementById('searchText');
					const searchSubmitBtn = document.getElementById('searchSubmitBtn');
													
					let isSearchOpen = false;
								
					searchToggleBtn.addEventListener('click', function(e) {
						if (!isSearchOpen) {
							e.preventDefault();
							isSearchOpen = true;
							
							searchForm.style.background = 'rgba(255, 255, 255, 0.2)';
							searchForm.style.borderColor = 'rgba(255, 255, 255, 0.5)';
							
							searchText.style.display = 'none';
							
							searchInput.style.width = '180px';
							searchInput.style.opacity = '1';
							searchInput.style.paddingLeft = '5px';
							searchInput.focus();
															
							searchSubmitBtn.style.display = 'block';
						}
					});
								
					document.addEventListener('click', function(e) {
						if (isSearchOpen && !searchForm.contains(e.target) && searchInput.value === '') {
							isSearchOpen = false;
							searchForm.style.background = 'rgba(255, 255, 255, 0.1)';
							searchForm.style.borderColor = 'rgba(255, 255, 255, 0.2)';
															
							searchText.style.display = 'block';
															
							searchInput.style.width = '0';
							searchInput.style.opacity = '0';
							searchInput.style.paddingLeft = '0';
															
							searchSubmitBtn.style.display = 'none';
						}
          });

          fetch('https://api.open-meteo.com/v1/forecast?latitude=32.7157&longitude=-117.1611&current_weather=true&temperature_unit=fahrenheit')
																																									.then(response => response.json())
																																									.then(data => {
																																										if (data && data.current_weather && data.current_weather.temperature) {
																																											document.getElementById('live-temperature').innerText = Math.round(data.current_weather.temperature) + '°';
																																										}
																																									})
																																									.catch(error => console.error('Error fetching weather:', error));
