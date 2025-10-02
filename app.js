// Application State
let portfolioData = {
    transactions: [],
    schemes: {},
    currentNAVs: {},
    historicalData: {}
};

let charts = {};
let currentTimePeriod = '3M';

// Sample Data
const sampleData = {
    "transactions": [
        {
            "transactionDate": "2021-01-15",
            "schemeName": "HDFC Top 100 Fund - Direct Growth",
            "isin": "INF179K01158",
            "folioNumber": "12345/67",
            "transactionType": "Purchase",
            "price": 650.25,
            "units": 153.84,
            "balanceUnits": 153.84,
            "amount": 100000,
            "marketValue": 100000
        },
        {
            "transactionDate": "2021-02-15",
            "schemeName": "HDFC Top 100 Fund - Direct Growth", 
            "isin": "INF179K01158",
            "folioNumber": "12345/67",
            "transactionType": "Purchase",
            "price": 675.50,
            "units": 148.07,
            "balanceUnits": 301.91,
            "amount": 100000,
            "marketValue": 204000
        },
        {
            "transactionDate": "2021-01-20",
            "schemeName": "SBI Small Cap Fund - Direct Growth",
            "isin": "INF200K01204",
            "folioNumber": "98765/43",
            "transactionType": "Purchase", 
            "price": 85.45,
            "units": 1170.56,
            "balanceUnits": 1170.56,
            "amount": 100000,
            "marketValue": 100000
        },
        {
            "transactionDate": "2021-03-15",
            "schemeName": "Axis Bluechip Fund - Direct Growth",
            "isin": "INF846K01100",
            "folioNumber": "55555/11",
            "transactionType": "Purchase",
            "price": 45.25,
            "units": 2209.94,
            "balanceUnits": 2209.94,
            "amount": 100000,
            "marketValue": 100000
        },
        {
            "transactionDate": "2022-01-15",
            "schemeName": "Mirae Asset Large Cap Fund - Direct Growth",
            "isin": "INF769K01021",
            "folioNumber": "77777/22",
            "transactionType": "Purchase",
            "price": 72.80,
            "units": 1373.63,
            "balanceUnits": 1373.63,
            "amount": 100000,
            "marketValue": 100000
        },
        {
            "transactionDate": "2022-06-15",
            "schemeName": "ICICI Prudential Bluechip Fund - Direct Growth",
            "isin": "INF109K01131",
            "folioNumber": "33333/88",
            "transactionType": "Purchase",
            "price": 95.50,
            "units": 1047.12,
            "balanceUnits": 1047.12,
            "amount": 100000,
            "marketValue": 100000
        }
    ],
    "currentNAVs": {
        "INF179K01158": 895.75,
        "INF200K01204": 142.30,
        "INF846K01100": 68.90,
        "INF769K01021": 105.25,
        "INF109K01131": 125.80
    },
    "schemeDetails": {
        "INF179K01158": {
            "name": "HDFC Top 100 Fund - Direct Growth",
            "category": "Large Cap",
            "amc": "HDFC Mutual Fund",
            "riskLevel": "Moderately High",
            "benchmark": "Nifty 100"
        },
        "INF200K01204": {
            "name": "SBI Small Cap Fund - Direct Growth", 
            "category": "Small Cap",
            "amc": "SBI Mutual Fund",
            "riskLevel": "Very High",
            "benchmark": "Nifty Smallcap 100"
        },
        "INF846K01100": {
            "name": "Axis Bluechip Fund - Direct Growth",
            "category": "Large Cap", 
            "amc": "Axis Mutual Fund",
            "riskLevel": "Moderately High",
            "benchmark": "Nifty 50"
        },
        "INF769K01021": {
            "name": "Mirae Asset Large Cap Fund - Direct Growth",
            "category": "Large Cap",
            "amc": "Mirae Asset Mutual Fund", 
            "riskLevel": "Moderately High",
            "benchmark": "Nifty 100"
        },
        "INF109K01131": {
            "name": "ICICI Prudential Bluechip Fund - Direct Growth",
            "category": "Large Cap",
            "amc": "ICICI Prudential Mutual Fund",
            "riskLevel": "Moderately High", 
            "benchmark": "Nifty 100"
        }
    },
    "historicalData": {
        "INF179K01158": [
            {"date": "2021-01-01", "nav": 650.25},
            {"date": "2021-06-01", "nav": 720.50},
            {"date": "2021-12-01", "nav": 785.30},
            {"date": "2022-06-01", "nav": 750.80},
            {"date": "2022-12-01", "nav": 825.60},
            {"date": "2023-06-01", "nav": 870.25},
            {"date": "2023-12-01", "nav": 895.75}
        ],
        "INF200K01204": [
            {"date": "2021-01-01", "nav": 85.45},
            {"date": "2021-06-01", "nav": 102.30},
            {"date": "2021-12-01", "nav": 118.75},
            {"date": "2022-06-01", "nav": 108.90},
            {"date": "2022-12-01", "nav": 125.40},
            {"date": "2023-06-01", "nav": 138.60},
            {"date": "2023-12-01", "nav": 142.30}
        ],
        "INF846K01100": [
            {"date": "2021-03-01", "nav": 45.25},
            {"date": "2021-09-01", "nav": 52.80},
            {"date": "2022-03-01", "nav": 49.75},
            {"date": "2022-09-01", "nav": 58.60},
            {"date": "2023-03-01", "nav": 64.20},
            {"date": "2023-09-01", "nav": 68.90}
        ]
    }
};

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function formatNumber(number, decimals = 2) {
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals
    }).format(number);
}

function calculateCAGR(initialValue, finalValue, years) {
    if (years <= 0 || initialValue <= 0) return 0;
    return (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
}

function calculateXIRR(transactions) {
    // Simplified XIRR calculation
    if (transactions.length < 2) return 0;
    
    let totalInvested = 0;
    let totalCurrent = 0;
    let firstDate = new Date(transactions[0].transactionDate);
    let lastDate = new Date();
    
    transactions.forEach(t => {
        if (t.transactionType === 'Purchase') {
            totalInvested += Math.abs(t.amount);
        }
    });
    
    // Calculate current value from holdings
    const holdings = calculateHoldings();
    totalCurrent = Object.values(holdings).reduce((sum, holding) => 
        sum + holding.currentValue, 0);
    
    const years = (lastDate - firstDate) / (365.25 * 24 * 60 * 60 * 1000);
    return calculateCAGR(totalInvested, totalCurrent, years);
}

function calculateHoldings() {
    const holdings = {};
    
    portfolioData.transactions.forEach(transaction => {
        const isin = transaction.isin;
        
        if (!holdings[isin]) {
            holdings[isin] = {
                schemeName: transaction.schemeName,
                totalUnits: 0,
                totalInvested: 0,
                currentNAV: portfolioData.currentNAVs[isin] || 0,
                transactions: []
            };
        }
        
        holdings[isin].transactions.push(transaction);
        
        if (transaction.transactionType === 'Purchase') {
            holdings[isin].totalUnits += transaction.units;
            holdings[isin].totalInvested += Math.abs(transaction.amount);
        } else if (transaction.transactionType === 'Redemption') {
            holdings[isin].totalUnits -= transaction.units;
            holdings[isin].totalInvested -= Math.abs(transaction.amount);
        }
    });
    
    // Calculate current values
    Object.keys(holdings).forEach(isin => {
        const holding = holdings[isin];
        holding.currentValue = holding.totalUnits * holding.currentNAV;
        holding.returns = holding.currentValue - holding.totalInvested;
        holding.returnsPercent = holding.totalInvested > 0 ? 
            (holding.returns / holding.totalInvested) * 100 : 0;
        holding.category = portfolioData.schemes[isin]?.category || 'Unknown';
    });
    
    return holdings;
}

function updatePortfolioSummary() {
    const holdings = calculateHoldings();
    const totalInvestment = Object.values(holdings).reduce((sum, h) => sum + h.totalInvested, 0);
    const currentValue = Object.values(holdings).reduce((sum, h) => sum + h.currentValue, 0);
    const totalReturns = currentValue - totalInvestment;
    const totalReturnsPercent = totalInvestment > 0 ? (totalReturns / totalInvestment) * 100 : 0;
    const totalSchemes = Object.keys(holdings).length;
    
    document.getElementById('totalInvestment').textContent = formatCurrency(totalInvestment);
    document.getElementById('currentValue').textContent = formatCurrency(currentValue);
    document.getElementById('totalReturns').textContent = formatCurrency(totalReturns);
    
    const returnsPercentEl = document.getElementById('totalReturnsPercent');
    returnsPercentEl.textContent = `${totalReturns >= 0 ? '+' : ''}${formatNumber(totalReturnsPercent, 1)}%`;
    returnsPercentEl.className = `summary-card__percentage ${totalReturns >= 0 ? 'positive' : 'negative'}`;
    
    document.getElementById('totalSchemes').textContent = totalSchemes;
}

function updateHoldingsTable() {
    const holdings = calculateHoldings();
    const tbody = document.getElementById('holdingsTableBody');
    tbody.innerHTML = '';
    
    Object.entries(holdings).forEach(([isin, holding]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="max-width: 200px;">
                    <strong>${holding.schemeName}</strong><br>
                    <small>ISIN: ${isin}</small>
                </div>
            </td>
            <td>
                <span class="status status--info">${holding.category}</span>
            </td>
            <td>${formatNumber(holding.totalUnits, 3)}</td>
            <td>${formatCurrency(holding.totalInvested)}</td>
            <td>${formatCurrency(holding.currentValue)}</td>
            <td class="${holding.returns >= 0 ? 'returns-positive' : 'returns-negative'}">
                ${formatCurrency(holding.returns)}
            </td>
            <td class="${holding.returns >= 0 ? 'returns-positive' : 'returns-negative'}">
                ${holding.returns >= 0 ? '+' : ''}${formatNumber(holding.returnsPercent, 1)}%
            </td>
            <td>
                <button class="btn btn--outline view-details-btn" onclick="showSchemeDetails('${isin}')">
                    View Details
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateAnalytics() {
    const holdings = calculateHoldings();
    const transactions = portfolioData.transactions;
    
    // Calculate CAGR (3Y)
    const cagr3y = calculateXIRR(transactions);
    document.getElementById('cagr3y').textContent = `${formatNumber(cagr3y, 1)}%`;
    
    // Calculate XIRR
    const xirr = calculateXIRR(transactions);
    document.getElementById('xirr').textContent = `${formatNumber(xirr, 1)}%`;
    
    // Mock volatility and Sharpe ratio
    document.getElementById('volatility').textContent = `${formatNumber(15.5, 1)}%`;
    document.getElementById('sharpeRatio').textContent = formatNumber(0.85, 2);
    
    // Update allocation breakdown
    const categoryAllocation = {};
    let totalValue = 0;
    
    Object.values(holdings).forEach(holding => {
        const category = holding.category;
        if (!categoryAllocation[category]) {
            categoryAllocation[category] = 0;
        }
        categoryAllocation[category] += holding.currentValue;
        totalValue += holding.currentValue;
    });
    
    const allocationBreakdown = document.getElementById('allocationBreakdown');
    allocationBreakdown.innerHTML = '';
    
    Object.entries(categoryAllocation).forEach(([category, value]) => {
        const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
        const item = document.createElement('div');
        item.className = 'allocation-item';
        item.innerHTML = `
            <span class="allocation-category">${category}</span>
            <span class="allocation-percentage">${formatNumber(percentage, 1)}%</span>
        `;
        allocationBreakdown.appendChild(item);
    });
}

function createPortfolioTrendChart() {
    const ctx = document.getElementById('portfolioTrendChart').getContext('2d');
    
    // Generate mock historical portfolio data
    const dates = [];
    const values = [];
    const currentDate = new Date();
    
    for (let i = 90; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString());
        
        // Mock portfolio growth
        const baseValue = 500000;
        const growth = (90 - i) / 90 * 0.25; // 25% growth over period
        const randomVariation = (Math.random() - 0.5) * 0.05; // ±2.5% random variation
        values.push(baseValue * (1 + growth + randomVariation));
    }
    
    if (charts.portfolioTrend) {
        charts.portfolioTrend.destroy();
    }
    
    charts.portfolioTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Portfolio Value',
                data: values,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Portfolio Value Trend'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                x: {
                    display: false
                }
            }
        }
    });
}

function createAllocationChart() {
    const ctx = document.getElementById('allocationChart').getContext('2d');
    const holdings = calculateHoldings();
    
    const categoryData = {};
    Object.values(holdings).forEach(holding => {
        const category = holding.category;
        if (!categoryData[category]) {
            categoryData[category] = 0;
        }
        categoryData[category] += holding.currentValue;
    });
    
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
    
    if (charts.allocation) {
        charts.allocation.destroy();
    }
    
    charts.allocation = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Asset Allocation'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createPerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    const holdings = calculateHoldings();
    
    const schemes = Object.values(holdings).map(h => h.schemeName.substring(0, 20) + '...');
    const returns = Object.values(holdings).map(h => h.returnsPercent);
    
    if (charts.performance) {
        charts.performance.destroy();
    }
    
    charts.performance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: schemes,
            datasets: [{
                label: 'Returns (%)',
                data: returns,
                backgroundColor: returns.map(r => r >= 0 ? '#1FB8CD' : '#B4413C'),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Scheme-wise Performance'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function calculateProjections() {
    const sipAmount = parseFloat(document.getElementById('sipAmount').value) || 10000;
    const expectedReturn = parseFloat(document.getElementById('expectedReturn').value) || 12;
    const monthlyReturn = expectedReturn / 100 / 12;
    
    // Current portfolio value
    const holdings = calculateHoldings();
    const currentValue = Object.values(holdings).reduce((sum, h) => sum + h.currentValue, 0);
    
    // Calculate projections
    const projections = [1, 3, 5].map(years => {
        const months = years * 12;
        
        // Future value of current investments
        const currentInvestmentFV = currentValue * Math.pow(1 + expectedReturn/100, years);
        
        // Future value of SIP
        const sipFV = sipAmount * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
        
        const totalFV = currentInvestmentFV + sipFV;
        const totalInvested = currentValue + (sipAmount * months);
        const gain = totalFV - totalInvested;
        
        return { totalFV, gain, years };
    });
    
    projections.forEach((proj, index) => {
        const suffix = proj.years === 1 ? '1y' : proj.years === 3 ? '3y' : '5y';
        document.getElementById(`projection${suffix}`).textContent = formatCurrency(proj.totalFV);
        document.getElementById(`projectionGain${suffix}`).textContent = `Gain: ${formatCurrency(proj.gain)}`;
    });
    
    createProjectionChart(projections, sipAmount, expectedReturn);
}

function createProjectionChart(projections, sipAmount, expectedReturn) {
    const ctx = document.getElementById('projectionChart').getContext('2d');
    
    const years = projections.map(p => `Year ${p.years}`);
    const values = projections.map(p => p.totalFV);
    const gains = projections.map(p => p.gain);
    
    if (charts.projection) {
        charts.projection.destroy();
    }
    
    charts.projection = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Projected Value',
                    data: values,
                    backgroundColor: '#1FB8CD',
                    borderWidth: 1
                },
                {
                    label: 'Projected Gains',
                    data: gains,
                    backgroundColor: '#FFC185',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Investment Projections'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function showSchemeDetails(isin) {
    const scheme = portfolioData.schemes[isin];
    const holdings = calculateHoldings();
    const holding = holdings[isin];
    
    if (!scheme || !holding) return;
    
    const modal = document.getElementById('schemeModal');
    const title = document.getElementById('schemeModalTitle');
    const details = document.getElementById('schemeDetails');
    
    title.textContent = scheme.name;
    
    details.innerHTML = `
        <div class="scheme-detail-item">
            <div class="scheme-detail-label">AMC</div>
            <div class="scheme-detail-value">${scheme.amc}</div>
        </div>
        <div class="scheme-detail-item">
            <div class="scheme-detail-label">Category</div>
            <div class="scheme-detail-value">${scheme.category}</div>
        </div>
        <div class="scheme-detail-item">
            <div class="scheme-detail-label">Risk Level</div>
            <div class="scheme-detail-value">${scheme.riskLevel}</div>
        </div>
        <div class="scheme-detail-item">
            <div class="scheme-detail-label">Benchmark</div>
            <div class="scheme-detail-value">${scheme.benchmark}</div>
        </div>
        <div class="scheme-detail-item">
            <div class="scheme-detail-label">Units Held</div>
            <div class="scheme-detail-value">${formatNumber(holding.totalUnits, 3)}</div>
        </div>
        <div class="scheme-detail-item">
            <div class="scheme-detail-label">Current NAV</div>
            <div class="scheme-detail-value">₹${formatNumber(holding.currentNAV)}</div>
        </div>
        <div class="scheme-detail-item">
            <div class="scheme-detail-label">Total Investment</div>
            <div class="scheme-detail-value">${formatCurrency(holding.totalInvested)}</div>
        </div>
        <div class="scheme-detail-item">
            <div class="scheme-detail-label">Current Value</div>
            <div class="scheme-detail-value">${formatCurrency(holding.currentValue)}</div>
        </div>
    `;
    
    // Create scheme performance chart
    createSchemeChart(isin);
    
    modal.classList.remove('hidden');
}

function createSchemeChart(isin) {
    const ctx = document.getElementById('schemeChart').getContext('2d');
    const historicalData = portfolioData.historicalData[isin] || [];
    
    const dates = historicalData.map(d => new Date(d.date).toLocaleDateString());
    const navs = historicalData.map(d => d.nav);
    
    if (charts.scheme) {
        charts.scheme.destroy();
    }
    
    charts.scheme = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'NAV',
                data: navs,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'NAV Performance'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            }
        }
    });
}

function loadSampleData() {
    portfolioData.transactions = [...sampleData.transactions];
    portfolioData.currentNAVs = {...sampleData.currentNAVs};
    portfolioData.schemes = {...sampleData.schemeDetails};
    portfolioData.historicalData = {...sampleData.historicalData};
    
    updateAllViews();
    
    // Close modal
    document.getElementById('uploadModal').classList.add('hidden');
    
    // Show success message
    alert('Sample data loaded successfully!');
}

function updateAllViews() {
    updatePortfolioSummary();
    updateHoldingsTable();
    updateAnalytics();
    createPortfolioTrendChart();
    createAllocationChart();
    createPerformanceChart();
    calculateProjections();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation
    document.querySelectorAll('.nav-tabs__button').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab
            document.querySelectorAll('.nav-tabs__button').forEach(b => 
                b.classList.remove('nav-tabs__button--active'));
            this.classList.add('nav-tabs__button--active');
            
            // Update active content
            document.querySelectorAll('.tab-content').forEach(content => 
                content.classList.remove('tab-content--active'));
            document.getElementById(tabId).classList.add('tab-content--active');
        });
    });
    
    // Time period filters
    document.querySelectorAll('.time-filter').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.time-filter').forEach(b => 
                b.classList.remove('active'));
            this.classList.add('active');
            currentTimePeriod = this.dataset.period;
            createPortfolioTrendChart(); // Recreate chart with new time period
        });
    });
    
    // Upload modal
    document.getElementById('uploadBtn').addEventListener('click', function() {
        document.getElementById('uploadModal').classList.remove('hidden');
    });
    
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('uploadModal').classList.add('hidden');
    });
    
    document.getElementById('loadSampleData').addEventListener('click', loadSampleData);
    
    // Scheme modal
    document.getElementById('closeSchemeModal').addEventListener('click', function() {
        document.getElementById('schemeModal').classList.add('hidden');
    });
    
    // File upload simulation
    document.getElementById('dropzone').addEventListener('click', function() {
        document.getElementById('excelFile').click();
    });
    
    document.getElementById('excelFile').addEventListener('change', function() {
        if (this.files.length > 0) {
            const fileName = this.files[0].name;
            document.getElementById('dropzone').innerHTML = `
                <div class="upload-icon">✓</div>
                <p>File selected: ${fileName}</p>
                <small>Click "Process Upload" to import data</small>
            `;
        }
    });
    
    document.getElementById('processUpload').addEventListener('click', function() {
        const fileInput = document.getElementById('excelFile');
        if (fileInput.files.length > 0) {
            // Simulate file processing
            alert('File upload simulation - In a real application, this would parse the Excel file and import transactions.');
            loadSampleData(); // Load sample data as demonstration
        } else {
            alert('Please select a file first.');
        }
    });
    
    // Projection calculation
    document.getElementById('calculateProjections').addEventListener('click', calculateProjections);
    
    // Custom date range
    document.getElementById('customDateBtn').addEventListener('click', function() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (startDate && endDate) {
            // Remove active class from time filters
            document.querySelectorAll('.time-filter').forEach(b => 
                b.classList.remove('active'));
            createPortfolioTrendChart(); // Recreate chart with custom date range
        }
    });
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        
        const themeIcon = document.getElementById('themeIcon');
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });
    
    // Load sample data by default for demonstration
    loadSampleData();
});

// Global function for scheme details
window.showSchemeDetails = showSchemeDetails;