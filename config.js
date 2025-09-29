// في dashboard.html - استبدل كل الـ JavaScript بهذا:

// وظائف عرض التطبيقات
function renderApps() {
    const apps = getApps();
    const container = document.getElementById('appsContainer');
    
    if (!container) return;
    
    if (apps.length === 0) {
        container.innerHTML = '<p>لا توجد تطبيقات</p>';
        return;
    }
    
    container.innerHTML = apps.map(app => `
        <div class="app-item">
            <h3>${app.name}</h3>
            <p>${app.description}</p>
            <div class="app-meta">
                <span>📱 ${app.category}</span>
                <span>⭐ ${app.rating}</span>
                <span>⬇️ ${app.downloads}</span>
            </div>
        </div>
    `).join('');
}

// معالجة إضافة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    renderApps();
    
    const appForm = document.getElementById('appForm');
    if (appForm) {
        appForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('appName').value,
                category: document.getElementById('appCategory').value,
                version: document.getElementById('appVersion').value,
                size: document.getElementById('appSize').value + ' MB',
                rating: document.getElementById('appRating').value,
                downloads: parseInt(document.getElementById('appDownloads').value),
                description: document.getElementById('appDescription').value
            };
            
            if (addApp(formData)) {
                alert('تم إضافة التطبيق بنجاح!');
                this.reset();
                renderApps();
            }
        });
    }
});
