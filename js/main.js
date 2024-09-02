
        const apiKey = 'ea134c3b959845c1383c4125eb380b2f';
        
        function getWeather(location) {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    updateCurrentWeather(data);
                    return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`);
                })
                .then(response => response.json())
                .then(data => {
                    updateForecast(data);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    alert('City not found. Please try again.');
                });
        }

        function updateCurrentWeather(data) {
            document.getElementById('location').textContent = data.name;
            document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°`;
            document.getElementById('weather-info').innerHTML = `
                <div>${data.weather[0].description} ${Math.round(data.main.temp_max)}°/${Math.round(data.main.temp_min)}°</div>
                <div id="air-quality">Luftqualität ${Math.round(data.main.humidity / 2)}</div>
            `;
        }

        function updateForecast(data) {
            const forecastItems = document.querySelector('.forecast-items');
            forecastItems.innerHTML = '';

            // Group forecast data by day
            const dailyForecasts = data.list.reduce((acc, item) => {
                const date = new Date(item.dt * 1000).toLocaleDateString('en-US');
                if (!acc[date]) {
                    acc[date] = {
                        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                        icon: item.weather[0].icon,
                        temp_max: item.main.temp_max,
                        temp_min: item.main.temp_min
                    };
                } else {
                    acc[date].temp_max = Math.max(acc[date].temp_max, item.main.temp_max);
                    acc[date].temp_min = Math.min(acc[date].temp_min, item.main.temp_min);
                }
                return acc;
            }, {});

            // Take only the first 5 days
            Object.values(dailyForecasts).slice(0, 5).forEach(forecast => {
                const forecastItem = document.createElement('div');
                forecastItem.classList.add('forecast-item');
                forecastItem.innerHTML = `
                    <div>${forecast.day}</div>
                    <img src="http://openweathermap.org/img/w/${forecast.icon}.png" alt="Weather icon">
                    <div>${Math.round(forecast.temp_max)}°/${Math.round(forecast.temp_min)}°</div>
                `;
                forecastItems.appendChild(forecastItem);
            });
        }

        // Add event listener for city search
        document.getElementById('city-search').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                getWeather(this.value);
            }
        });

        // Default to Prague weather on load
        getWeather('Prague');

        // Update time in status bar
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            document.querySelector('#status-bar span:first-child').textContent = timeString;
        }

        setInterval(updateTime, 1000);
        updateTime();
