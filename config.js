// =============================================
// ملف التهيئة والإعدادات - config.js
// =============================================

// إعدادات التطبيق
const CONFIG = {
    appName: "Sudan Play Dashboard",
    version: "1.0.0",
    apiUrl: "https://api.sudanplay.com",
    maxFileSize: 5 * 1024 * 1024, // 5MB
    supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    defaultAppIcon: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop"
};

// فئات التطبيقات المتاحة
const APP_CATEGORIES = [
    "أخبار",
    "موسيقى", 
    "تسوق",
    "تعليم",
    "أدوات",
    "ترفيه",
    "رياضة",
    "صحة",
    "سفر"
];

// بيانات التطبيقات - سيتم حفظها في localStorage
let apps = JSON.parse(localStorage.getItem('sudanPlayApps')) || [
    {
        id: 1,
        name: "سودان نيوز",
        description: "تطبيق متكامل يقدم آخر الأخبار السودانية من مصادر موثوقة. احصل على التحديثات الفورية والأخبار العاجلة في جميع المجالات السياسية والاقتصادية والرياضية.",
        category: "أخبار",
        icon: "https://images.unsplash.com/photo-1586339949216-35c2747cc36c?w=200&h=200&fit=crop",
        version: "2.1.0",
        rating: "4.8",
        downloads: 12543,
        size: "15 MB",
        screenshots: [
            "https://images.unsplash.com/photo-1556655848-f3a79cc6d4a9?w=300&h=600&fit=crop",
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=600&fit=crop"
        ],
        downloadUrl: "#"
    },
    {
        id: 2, 
        name: "سودان ميوزك",
        description: "أكبر منصة موسيقية سودانية تحتوي على آلاف الأغاني من التراث السوداني والموسيقى المعاصرة. استمع وتحميل ومشاركة أفضل الألحان.",
        category: "موسيقى",
        icon: "https://images.unsplash.com/photo-1571974599782-87624638275f?w=200&h=200&fit=crop",
        version: "1.5.2", 
        rating: "4.9",
        downloads: 28764,
        size: "28 MB",
        screenshots: [
            "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=600&fit=crop"
        ],
        downloadUrl: "#"
    }
];

// =============================================
// وظائف إدارة البيانات
// =============================================

// حفظ البيانات في localStorage
function saveAppsToStorage() {
    localStorage.setItem('sudanPlayApps', JSON.stringify(apps));
    updateStats();
    renderApps();
}

// تحديث الإحصائيات
function updateStats() {
    const totalApps = apps.length;
    const totalDownloads = apps.reduce((sum, app) => sum + app.downloads, 0);
    const avgRating = totalApps > 0 ? (apps.reduce((sum, app) => sum + parseFloat(app.rating), 0) / totalApps).toFixed(1) : "0.0";

    document.getElementById('totalApps').textContent = totalApps;
    document.getElementById('totalDownloads').textContent = totalDownloads.toLocaleString();
    document.getElementById('avgRating').textContent = avgRating;
    document.getElementById('appsCount').textContent = `${totalApps} تطبيق`;
}

// عرض التطبيقات
function renderApps() {
    const appsList = document.getElementById('appsList');
    
    if (apps.length === 0) {
        appsList.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-mobile-alt" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p>لا توجد تطبيقات مضافة حتى الآن</p>
            </div>
        `;
        return;
    }

    appsList.innerHTML = apps.map(app => `
        <div class="app-item">
            <img src="${app.icon}" alt="${app.name}" class="app-image" onerror="this.src='${CONFIG.defaultAppIcon}'">
            <div class="app-details">
                <div class="app-header">
                    <div class="app-title">
                        <h3>${app.name}</h3>
                        <span class="app-category">${app.category}</span>
                    </div>
                    <div class="app-actions">
                        <button class="action-btn edit-btn" onclick="editApp(${app.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteApp(${app.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="app-description">${app.description}</p>
                <div class="app-meta">
                    <span><i class="fas fa-download"></i> ${app.downloads.toLocaleString()} تحميل</span>
                    <span><i class="fas fa-star"></i> ${app.rating}</span>
                    <span><i class="fas fa-code-branch"></i> ${app.version}</span>
                    <span><i class="fas fa-weight-hanging"></i> ${app.size}</span>
                </div>
                ${app.screenshots && app.screenshots.length > 0 ? `
                    <div style="margin-top: 1rem;">
                        <small style="color: #666;">${app.screenshots.length} لقطة شاشة</small>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// =============================================
// وظائف معالجة النماذج
// =============================================

// معالجة رفع الصور
function setupFileUploads() {
    // أيقونة التطبيق
    document.getElementById('appIcon').addEventListener('change', function(e) {
        handleImageUpload(e, 'iconPreview');
    });

    // صورة الغلاف
    document.getElementById('appCover').addEventListener('change', function(e) {
        handleImageUpload(e, 'coverPreview');
    });

    // لقطات الشاشة
    document.getElementById('appScreenshots').addEventListener('change', function(e) {
        handleScreenshotsUpload(e);
    });
}

function handleImageUpload(event, previewId) {
    const file = event.target.files[0];
    if (file) {
        // التحقق من نوع الملف
        if (!CONFIG.supportedImageTypes.includes(file.type)) {
            alert('نوع الملف غير مدعوم. الرجاء اختيار صورة بصيغة JPEG, PNG, أو WebP.');
            return;
        }

        // التحقق من حجم الملف
        if (file.size > CONFIG.maxFileSize) {
            alert('حجم الملف كبير جداً. الحد الأقصى هو 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById(previewId).src = e.target.result;
            document.getElementById(previewId).style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
}

function handleScreenshotsUpload(event) {
    const files = event.target.files;
    const container = document.getElementById('screenshotsPreview');
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!CONFIG.supportedImageTypes.includes(file.type)) {
            alert(`الملف ${file.name} نوعه غير مدعوم.`);
            continue;
        }

        if (file.size > CONFIG.maxFileSize) {
            alert(`الملف ${file.name} حجمه كبير جداً.`);
            continue;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const screenshotDiv = document.createElement('div');
            screenshotDiv.className = 'screenshot-preview';
            screenshotDiv.innerHTML = `
                <img src="${e.target.result}" alt="لقطة شاشة">
                <button type="button" class="remove-screenshot" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(screenshotDiv);
        }
        reader.readAsDataURL(file);
    }
}

// =============================================
// وظائف إدارة التطبيقات
// =============================================

// إضافة تطبيق جديد
function addApp(appData) {
    const newApp = {
        id: Date.now(), // استخدام timestamp كمعرف فريد
        ...appData,
        screenshots: getScreenshotsFromPreview(),
        downloadUrl: "#"
    };
    
    apps.push(newApp);
    saveAppsToStorage();
}

// الحصول على لقطات الشاشة من المعاينة
function getScreenshotsFromPreview() {
    const screenshots = [];
    const previews = document.getElementById('screenshotsPreview').querySelectorAll('img');
    previews.forEach(img => {
        screenshots.push(img.src);
    });
    return screenshots;
}

// تعديل تطبيق
function editApp(id) {
    const app = apps.find(a => a.id === id);
    if (app) {
        // ملء النموذج ببيانات التطبيق
        document.getElementById('appName').value = app.name;
        document.getElementById('appCategory').value = app.category;
        document.getElementById('appVersion').value = app.version;
        document.getElementById('appSize').value = parseInt(app.size);
        document.getElementById('appRating').value = app.rating;
        document.getElementById('appDownloads').value = app.downloads;
        document.getElementById('appDescription').value = app.description;
        
        // عرض الأيقونة
        if (app.icon) {
            document.getElementById('iconPreview').src = app.icon;
            document.getElementById('iconPreview').style.display = 'block';
        }
        
        // تمرير إلى أعلى الصفحة
        document.querySelector('.app-form').scrollIntoView({ behavior: 'smooth' });
        
        // تعيين معرف التطبيق للنموذج
        document.getElementById('appForm').dataset.editingId = id;
        
        alert(`ستقوم بتعديل تطبيق: ${app.name}`);
    }
}

// حذف تطبيق
function deleteApp(id) {
    if (confirm('هل أنت متأكد من حذف هذا التطبيق؟')) {
        apps = apps.filter(a => a.id !== id);
        saveAppsToStorage();
        alert('تم حذف التطبيق بنجاح!');
    }
}

// =============================================
// تهيئة التطبيق
// =============================================

function initializeDashboard() {
    // تهيئة رفع الملفات
    setupFileUploads();
    
    // تحديث الإحصائيات وعرض التطبيقات
    updateStats();
    renderApps();
    
    // معالجة إرسال النموذج
    document.getElementById('appForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // جمع البيانات من النموذج
        const formData = {
            name: document.getElementById('appName').value,
            category: document.getElementById('appCategory').value,
            version: document.getElementById('appVersion').value,
            size: document.getElementById('appSize').value + ' MB',
            rating: document.getElementById('appRating').value,
            downloads: parseInt(document.getElementById('appDownloads').value),
            description: document.getElementById('appDescription').value,
            icon: document.getElementById('iconPreview').src || CONFIG.defaultAppIcon
        };
        
        // التحقق من البيانات
        if (!formData.name || !formData.category || !formData.version) {
            alert('الرجاء ملء جميع الحقول المطلوبة');
            return;
        }
        
        // التحقق إذا كان تعديلاً أم إضافة جديدة
        const editingId = this.dataset.editingId;
        if (editingId) {
            // تعديل التطبيق الموجود
            const index = apps.findIndex(a => a.id == editingId);
            if (index !== -1) {
                apps[index] = { ...apps[index], ...formData };
                delete this.dataset.editingId;
            }
        } else {
            // إضافة تطبيق جديد
            addApp(formData);
        }
        
        // إعادة تعيين النموذج
        this.reset();
        document.getElementById('iconPreview').style.display = 'none';
        document.getElementById('coverPreview').style.display = 'none';
        document.getElementById('screenshotsPreview').innerHTML = '';
        
        // رسالة نجاح
        alert(editingId ? 'تم تعديل التطبيق بنجاح!' : 'تم إضافة التطبيق بنجاح!');
    });
    
    // إعادة تعيين النموذج عند النقر على إلغاء
    document.querySelector('button[type="reset"]').addEventListener('click', function() {
        document.getElementById('appForm').reset();
        document.getElementById('iconPreview').style.display = 'none';
        document.getElementById('coverPreview').style.display = 'none';
        document.getElementById('screenshotsPreview').innerHTML = '';
        delete document.getElementById('appForm').dataset.editingId;
    });
}
