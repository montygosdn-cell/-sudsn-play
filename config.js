// ... (داخل دالة document.addEventListener('DOMContentLoaded') في dashboard(3).html)

        // معالجة إرسال النموذج (إضافة أو تعديل)
        appForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // جمع بيانات النموذج
            const formData = {
                name: document.getElementById('appName').value,
                // ... بقية الحقول ...
                description: document.getElementById('appDescription').value,
            };

            const editingId = appForm.dataset.editingId;

            if (editingId) {
                // وضع التعديل (باستخدام getApps/saveApps الجديدة)
                let apps = getApps();
                const index = apps.findIndex(a => a.id == editingId);
                if (index !== -1) {
                    // تحديث بيانات التطبيق والحفاظ على الـ id مع تحويل أنواع البيانات
                    apps[index] = { 
                        ...apps[index], 
                        ...formData, 
                        id: parseInt(editingId),
                        size: parseFloat(formData.size) || 0,
                        rating: parseFloat(formData.rating) || 0,
                        downloads: parseInt(formData.downloads) || 0,
                    };
                    saveApps(apps); // حفظ التغييرات في localStorage
                    alert('تم تعديل التطبيق بنجاح!');
                }
            } else {
                // وضع الإضافة (باستخدام addApp الجديدة)
                addApp(formData);
                alert('تم إضافة التطبيق بنجاح!');
            }
            
            resetForm(); // إعادة تعيين النموذج بعد الإرسال
            renderApps(); // تحديث القائمة
        });
        
        // ... (معالج زر الإلغاء)
