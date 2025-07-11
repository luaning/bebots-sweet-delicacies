// Application State
let customers = [];
let orders = [];
let currentOrderId = 1;
let currentCustomerId = 1;
let selectedCustomer = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadSampleData();
    updateDashboard();
    loadOrders();
    setupEventListeners();
    
    // Set minimum date to today and default to current date/time
    setDefaultDateTime();
});

// Sample data with Filipino dishes and Philippine Peso
function loadSampleData() {
    customers = [
        {
            id: 1,
            name: "Maria Santos",
            phone: "09123456789"
        },
        {
            id: 2,
            name: "Juan Dela Cruz",
            phone: "09987654321"
        },
        {
            id: 3,
            name: "Ana Rodriguez",
            phone: "09555666777"
        }
    ];
    
    orders = [
        {
            id: 1,
            customerId: 1,
            orderType: "delivery",
            status: "pending",
            items: [
                { name: "Lechon Pakbet", quantity: 2, price: 1500 },
                { name: "Pancit Canton", quantity: 1, price: 800 }
            ],
            totalAmount: 3800,
            deliveryAddress: "123 Main St, Quezon City",
            notes: "Please deliver by 2 PM",
            pickupDeliveryDate: new Date(Date.now() + 86400000), // Tomorrow
            createdAt: new Date(Date.now() - 86400000) // Yesterday
        },
        {
            id: 2,
            customerId: 2,
            orderType: "pickup",
            status: "ready",
            items: [
                { name: "Chicken Adobo Tray", quantity: 1, price: 1200 },
                { name: "Garlic Rice", quantity: 3, price: 150 }
            ],
            totalAmount: 1650,
            deliveryAddress: null,
            notes: "Pickup at 5 PM",
            pickupDeliveryDate: new Date(Date.now() + 21600000), // 6 hours from now
            createdAt: new Date(Date.now() - 43200000) // 12 hours ago
        },
        {
            id: 3,
            customerId: 1,
            orderType: "delivery",
            status: "completed",
            items: [
                { name: "Beef Caldereta", quantity: 1, price: 1800 },
                { name: "Steamed Rice", quantity: 5, price: 100 }
            ],
            totalAmount: 2300,
            deliveryAddress: "456 Oak Street, Makati City",
            notes: "Thank you for the order!",
            pickupDeliveryDate: new Date(Date.now() - 86400000), // Yesterday (completed)
            createdAt: new Date(Date.now() - 172800000) // 2 days ago
        },
        {
            id: 4,
            customerId: 3,
            orderType: "pickup",
            status: "pending",
            items: [
                { name: "Pork Menudo", quantity: 2, price: 950 },
                { name: "Buko Pie", quantity: 1, price: 450 }
            ],
            totalAmount: 2350,
            deliveryAddress: null,
            notes: "Urgent order for tomorrow",
            pickupDeliveryDate: new Date(Date.now() + 43200000), // 12 hours from now
            createdAt: new Date(Date.now() - 3600000) // 1 hour ago
        },
        {
            id: 5,
            customerId: 2,
            orderType: "delivery",
            status: "ready",
            items: [
                { name: "Crispy Pata", quantity: 1, price: 2200 },
                { name: "Kare-Kare", quantity: 1, price: 1800 },
                { name: "Jasmine Rice", quantity: 4, price: 120 }
            ],
            totalAmount: 4480,
            deliveryAddress: "789 Pine Ave, Pasig City",
            notes: "Special occasion - birthday party",
            pickupDeliveryDate: new Date(Date.now() + 14400000), // 4 hours from now
            createdAt: new Date(Date.now() - 7200000) // 2 hours ago
        }
    ];
    
    currentOrderId = 6;
    currentCustomerId = 4;
}

// Set default date/time to current date/time
function setDefaultDateTime() {
    const now = new Date();
    // Add 1 hour to current time as default
    now.setHours(now.getHours() + 1);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    
    const dateInput = document.getElementById('pickup-delivery-date');
    if (dateInput) {
        // Set both minimum and default value
        const currentDateTime = now.toISOString().slice(0, 16);
        dateInput.min = new Date().toISOString().slice(0, 16);
        dateInput.value = currentDateTime;
    }
}

// Event Listeners
function setupEventListeners() {
    // Auto-calculate total when item inputs change
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('item-quantity') || e.target.classList.contains('item-price')) {
            calculateTotal();
        }
    });
    
    // Handle mobile menu responsiveness
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Reset mobile states if needed
        }
    });
}

// Navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    document.getElementById(pageId + '-page').classList.add('active');
    
    // Update navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    // Find and activate the correct nav button
    const navLabels = {
        'dashboard': 0,
        'orders': 1,
        'pending': 2,
        'ready': 3,
        'completed': 4,
        'new-order': 5
    };
    
    if (navLabels[pageId] !== undefined) {
        navButtons[navLabels[pageId]].classList.add('active');
    }
    
    // Load page-specific content
    if (pageId === 'dashboard') {
        updateDashboard();
    } else if (pageId === 'orders') {
        loadOrders();
    } else if (pageId === 'pending') {
        loadOrdersByStatus('pending');
    } else if (pageId === 'ready') {
        loadOrdersByStatus('ready');
    } else if (pageId === 'completed') {
        loadOrdersByStatus('completed');
    } else if (pageId === 'new-order') {
        resetOrderForm();
        setDefaultDateTime();
    }
}

// Dashboard Functions
function updateDashboard() {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const readyOrders = orders.filter(o => o.status === 'ready').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('ready-orders').textContent = readyOrders;
    document.getElementById('total-revenue').textContent = `₱${totalRevenue.toFixed(2)}`;
    
    // Load recent orders
    const recentOrders = orders.slice(-5).reverse(); // Last 5 orders, newest first
    const recentOrdersList = document.getElementById('recent-orders-list');
    
    if (recentOrders.length === 0) {
        recentOrdersList.innerHTML = `
            <div class="empty-state">
                <h3>No orders yet</h3>
                <p>Create your first order to get started</p>
                <button class="btn btn-primary" onclick="showPage('new-order')">+ Create First Order</button>
            </div>
        `;
    } else {
        recentOrdersList.innerHTML = recentOrders.map(order => {
            const customer = customers.find(c => c.id === order.customerId);
            return `
                <div class="order-card" onclick="showOrderDetails(${order.id})">
                    <div class="order-header">
                        <div class="order-info">
                            <h4>Order #${order.id}</h4>
                            <p>${customer ? customer.name : 'Unknown Customer'}</p>
                        </div>
                        <span class="status-badge status-${order.status}" onclick="event.stopPropagation(); cycleOrderStatus(${order.id})" style="cursor: pointer;" title="Click to change status">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>
                    <div class="order-details">
                        <p><strong>Total:</strong> ₱${order.totalAmount.toFixed(2)}</p>
                        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Orders Management
function loadOrders() {
    const ordersContainer = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-state">
                <h3>No orders yet</h3>
                <p>Create your first order to get started</p>
                <button class="btn btn-primary" onclick="showPage('new-order')">+ Create First Order</button>
            </div>
        `;
        return;
    }
    
    // Sort orders by date (newest first)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    ordersContainer.innerHTML = sortedOrders.map(order => generateOrderCardHTML(order)).join('');
}

// Helper function to generate order card HTML
function generateOrderCardHTML(order) {
    const customer = customers.find(c => c.id === order.customerId);
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const itemPreview = order.items.slice(0, 2).map(item => item.name).join(', ') + 
                       (order.items.length > 2 ? `, +${order.items.length - 2} more` : '');
    
    return `
        <div class="order-card" onclick="showOrderDetails(${order.id})">
            <div class="order-header">
                <div class="order-info">
                    <h3>Order #${order.id}</h3>
                    <p>${customer ? customer.name + ' • ' + customer.phone : 'Unknown Customer'}</p>
                </div>
                <span class="status-badge status-${order.status}" onclick="event.stopPropagation(); cycleOrderStatus(${order.id})">
                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </div>
            <div class="order-details">
                <p><strong>Created:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>${order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)} Date:</strong> ${new Date(order.pickupDeliveryDate).toLocaleDateString()} at ${new Date(order.pickupDeliveryDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <p><strong>Items:</strong> ${itemCount} item${itemCount !== 1 ? 's' : ''}: ${itemPreview}</p>
                <p class="order-total"><strong>Total:</strong> ₱${order.totalAmount.toFixed(2)}</p>
            </div>
        </div>
    `;
}

// Load orders filtered by status
function loadOrdersByStatus(status) {
    const containerId = status + '-list';
    const ordersContainer = document.getElementById(containerId);
    
    // Filter orders by status and sort by date (newest first)
    const filteredOrders = orders
        .filter(order => order.status === status)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (filteredOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-state">
                <h3>No ${status} orders</h3>
                <p>There are currently no orders with ${status} status</p>
                <button class="btn btn-primary" onclick="showPage('new-order')">+ Create New Order</button>
            </div>
        `;
        return;
    }
    
    ordersContainer.innerHTML = filteredOrders.map(order => generateOrderCardHTML(order)).join('');
}

function searchOrders() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filteredOrders = orders.filter(order => {
        const customer = customers.find(c => c.id === order.customerId);
        return (customer && customer.name.toLowerCase().includes(query)) ||
               (customer && customer.phone.includes(query)) ||
               order.id.toString().includes(query) ||
               order.status.toLowerCase().includes(query) ||
               order.items.some(item => item.name.toLowerCase().includes(query));
    });
    
    const ordersContainer = document.getElementById('orders-list');
    
    if (filteredOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-state">
                <h3>No orders found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    ordersContainer.innerHTML = filteredOrders.map(order => generateOrderCardHTML(order)).join('');
}

// Customer Management
function checkExistingCustomer() {
    const phone = document.getElementById('customer-phone').value;
    const existingCustomerDiv = document.getElementById('existing-customer');
    
    if (phone.length >= 10) {
        const customer = customers.find(c => c.phone === phone);
        
        if (customer) {
            // Show existing customer
            document.getElementById('existing-customer-name').textContent = customer.name;
            document.getElementById('existing-customer-details').textContent = customer.phone;
            existingCustomerDiv.style.display = 'block';
            selectedCustomer = customer;
            
            // Pre-fill form fields
            document.getElementById('customer-name').value = customer.name;
        } else {
            // Hide existing customer card
            existingCustomerDiv.style.display = 'none';
            selectedCustomer = null;
        }
    } else {
        existingCustomerDiv.style.display = 'none';
        selectedCustomer = null;
    }
}

function useExistingCustomer() {
    const phone = document.getElementById('customer-phone').value;
    const customer = customers.find(c => c.phone === phone);
    if (customer) {
        selectedCustomer = customer;
        document.getElementById('customer-name').value = customer.name;
        showToast('Customer selected: ' + customer.name, 'success');
    }
}

// Order Form Management
function resetOrderForm() {
    document.getElementById('order-form').reset();
    document.getElementById('existing-customer').style.display = 'none';
    document.getElementById('delivery-address-group').style.display = 'none';
    
    // Reset order items to single row
    const itemsContainer = document.getElementById('order-items');
    itemsContainer.innerHTML = `
        <div class="item-row">
            <input type="text" placeholder="Item name" class="item-name" required>
            <input type="number" placeholder="Qty" min="1" value="1" class="item-quantity">
            <input type="number" placeholder="Price (₱)" min="0" step="0.01" class="item-price">
            <button type="button" class="btn btn-danger" onclick="removeItem(this)" style="display: none;">×</button>
        </div>
    `;
    
    selectedCustomer = null;
    calculateTotal();
    
    // Set default date/time
    setDefaultDateTime();
}

function toggleDeliveryAddress() {
    const orderType = document.getElementById('order-type').value;
    const deliveryGroup = document.getElementById('delivery-address-group');
    
    if (orderType === 'delivery') {
        deliveryGroup.style.display = 'block';
        document.getElementById('delivery-address').required = true;
    } else {
        deliveryGroup.style.display = 'none';
        document.getElementById('delivery-address').required = false;
    }
}

function addItem() {
    const itemsContainer = document.getElementById('order-items');
    const itemCount = itemsContainer.querySelectorAll('.item-row').length;
    
    const newItem = document.createElement('div');
    newItem.className = 'item-row';
    newItem.innerHTML = `
        <input type="text" placeholder="Item name" class="item-name" required>
        <input type="number" placeholder="Qty" min="1" value="1" class="item-quantity">
        <input type="number" placeholder="Price (₱)" min="0" step="0.01" class="item-price">
        <button type="button" class="btn btn-danger" onclick="removeItem(this)">×</button>
    `;
    
    itemsContainer.appendChild(newItem);
    
    // Show remove buttons if more than one item
    if (itemCount >= 1) {
        const removeButtons = itemsContainer.querySelectorAll('.btn-danger');
        removeButtons.forEach(btn => btn.style.display = 'inline-block');
    }
    
    calculateTotal();
}

function removeItem(button) {
    const itemsContainer = document.getElementById('order-items');
    const itemRows = itemsContainer.querySelectorAll('.item-row');
    
    if (itemRows.length > 1) {
        button.parentElement.remove();
        
        // Hide remove buttons if only one item left
        const remainingRows = itemsContainer.querySelectorAll('.item-row');
        if (remainingRows.length === 1) {
            const removeButton = remainingRows[0].querySelector('.btn-danger');
            if (removeButton) {
                removeButton.style.display = 'none';
            }
        }
        
        calculateTotal();
    }
}

function calculateTotal() {
    const itemRows = document.querySelectorAll('.item-row');
    let total = 0;
    
    itemRows.forEach(row => {
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        total += quantity * price;
    });
    
    document.getElementById('order-total').textContent = total.toFixed(2);
}

function createOrder(event) {
    event.preventDefault();
    
    const customerPhone = document.getElementById('customer-phone').value;
    const customerName = document.getElementById('customer-name').value;
    const orderType = document.getElementById('order-type').value;
    const deliveryAddress = document.getElementById('delivery-address').value;
    const pickupDeliveryDate = document.getElementById('pickup-delivery-date').value;
    const orderNotes = document.getElementById('order-notes').value;
    
    // Validate required fields
    if (!customerName || !pickupDeliveryDate) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (orderType === 'delivery' && !deliveryAddress) {
        showToast('Please provide a delivery address', 'error');
        return;
    }
    
    // Get order items
    const itemRows = document.querySelectorAll('.item-row');
    const items = [];
    let hasValidItems = false;
    
    itemRows.forEach(row => {
        const name = row.querySelector('.item-name').value.trim();
        const quantity = parseInt(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        
        if (name && quantity > 0 && price >= 0) {
            items.push({ name, quantity, price });
            hasValidItems = true;
        }
    });
    
    if (!hasValidItems) {
        showToast('Please add at least one valid item', 'error');
        return;
    }
    
    // Find or create customer
    let customer = selectedCustomer;
    if (!customer) {
        customer = customerPhone ? customers.find(c => c.phone === customerPhone) : null;
        if (!customer) {
            customer = {
                id: currentCustomerId++,
                name: customerName,
                phone: customerPhone || null
            };
            customers.push(customer);
        }
    }
    
    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    // Create order
    const order = {
        id: currentOrderId++,
        customerId: customer.id,
        orderType,
        status: 'pending',
        items,
        totalAmount,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
        notes: orderNotes || null,
        pickupDeliveryDate: new Date(pickupDeliveryDate),
        createdAt: new Date()
    };
    
    orders.push(order);
    
    showToast('Order created successfully!', 'success');
    resetOrderForm();
    
    // Go back to orders page
    setTimeout(() => {
        showPage('orders');
    }, 1500);
}

// Order Details Modal
function showOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    const customer = customers.find(c => c.id === order.customerId);
    
    if (!order) {
        showToast('Order not found', 'error');
        return;
    }
    
    const modal = document.getElementById('order-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('order-details-content');
    
    modalTitle.textContent = `Order #${order.id}`;
    
    const itemsHTML = order.items.map(item => `
        <div class="item-detail">
            <span class="item-name">${item.name}</span>
            <span class="item-quantity">${item.quantity} x ₱${item.price.toFixed(2)}</span>
            <span class="item-total">₱${(item.quantity * item.price).toFixed(2)}</span>
        </div>
    `).join('');
    
    modalContent.innerHTML = `
        <div class="order-modal-content">
            <div class="customer-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${customer ? customer.name : 'Unknown'}</p>
                ${customer && customer.phone ? `<p><strong>Phone:</strong> ${customer.phone}</p>` : ''}
            </div>
            
            <div class="order-section">
                <h4>Order Information</h4>
                <p><strong>Order Type:</strong> ${order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${order.status}" onclick="cycleOrderStatus(${order.id})" style="cursor: pointer;" title="Click to change status">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></p>
                <p><strong>Created:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>${order.orderType === 'delivery' ? 'Delivery' : 'Pickup'} Date:</strong> ${new Date(order.pickupDeliveryDate).toLocaleString()}</p>
                ${order.deliveryAddress ? `<p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>` : ''}
                ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
            </div>
            
            <div class="items-section">
                <h4>Order Items</h4>
                <div class="items-list">
                    ${itemsHTML}
                </div>
                <div class="total-line">
                    <strong>Total: ₱${order.totalAmount.toFixed(2)}</strong>
                </div>
            </div>
            

        </div>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('order-modal');
    modal.classList.remove('active');
}

// Function to cycle through order statuses when clicking on status badge
function cycleOrderStatus(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // Status cycle: pending -> ready -> completed -> pending
    const statusCycle = {
        'pending': 'ready',
        'ready': 'completed',
        'completed': 'pending'
    };
    
    const newStatus = statusCycle[order.status] || 'pending';
    updateOrderStatus(orderId, newStatus);
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        showToast(`Order #${orderId} status updated to ${newStatus}`, 'success');
        
        // Update dashboard and current page
        updateDashboard();
        
        // Refresh the current page if it's a status-specific page
        const currentPage = document.querySelector('.page.active');
        if (currentPage) {
            const pageId = currentPage.id.replace('-page', '');
            if (['pending', 'ready', 'completed'].includes(pageId)) {
                loadOrdersByStatus(pageId);
            } else if (pageId === 'orders') {
                loadOrders();
            }
        }
        
        // Update modal if it's open
        const modal = document.getElementById('order-modal');
        if (modal.classList.contains('active')) {
            showOrderDetails(orderId);
        }
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Additional CSS for modal content
const additionalCSS = `
.order-modal-content {
    max-height: 70vh;
    overflow-y: auto;
}

.customer-section, .order-section, .items-section, .status-section {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
}

.customer-section h4, .order-section h4, .items-section h4, .status-section h4 {
    margin-bottom: 0.5rem;
    color: #1f2937;
}

.items-list {
    margin-bottom: 1rem;
}

.item-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e7eb;
}

.item-detail:last-child {
    border-bottom: none;
}

.item-name {
    flex: 1;
    font-weight: 500;
}

.item-quantity, .item-total {
    text-align: right;
    min-width: 80px;
}

.total-line {
    text-align: right;
    font-size: 1.2rem;
    padding-top: 0.5rem;
    border-top: 2px solid #1f2937;
}

#status-select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
}

@media (max-width: 768px) {
    .item-detail {
        flex-direction: column;
        text-align: left;
    }
    
    .item-quantity, .item-total {
        text-align: left;
        min-width: auto;
    }
}
`;

// Add the additional CSS to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);