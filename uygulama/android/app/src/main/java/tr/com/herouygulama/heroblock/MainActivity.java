package tr.com.herouygulama.heroblock;

import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.Display;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebView;
import androidx.activity.EdgeToEdge;
import androidx.activity.SystemBarStyle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Uygulama son kullanılanlardan ya da sistem kapattıktan sonra yeniden açılınca Android ilk açılıştaki bağlantıyı
        // (ör. eski bir düello daveti) yeniden verir: o bağlantı ilk açılışta açıldı, ikinci kez açılmasın
        Intent acilis = getIntent();
        if (acilis != null && acilis.getData() != null
                && (savedInstanceState != null || (acilis.getFlags() & Intent.FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY) != 0)) {
            setIntent(new Intent(acilis).setData(null));
        }
        // Önce Capacitor kendi temasını (başlık çubuğu olmayan AppTheme.NoActionBar) kurar ve oyunu yükler. Kenardan kenara
        // görünüm bundan SONRA açılır: önce açılırsa pencere açılış temasıyla kurulur ve Android 12 ve sonrasında üstte
        // "Hero Block" yazan bir başlık çubuğu kalır.
        super.onCreate(savedInstanceState);
        // Kenardan kenara: oyun durum ve gezinme çubuklarının arkasına uzanır (koyu zemin, açık simgeler); güvenli alanları
        // oyun kendisi bırakır
        EdgeToEdge.enable(this, SystemBarStyle.dark(Color.TRANSPARENT), SystemBarStyle.dark(Color.TRANSPARENT));
        // Web sitesi gibi esneme ya da kaydırma çubuğu yok: oyun ekrana sabit
        WebView webView = getBridge() != null ? getBridge().getWebView() : null;
        if (webView != null) {
            webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
            webView.setVerticalScrollBarEnabled(false);
            webView.setHorizontalScrollBarEnabled(false);
        }
        enYuksekYenilemeHizi();
    }

    @Override
    public void onResume() {
        super.onResume();
        // Ekran değişmiş olabilir (katlanabilir telefonun iç ve dış ekranı, harici ekran)
        enYuksekYenilemeHizi();
    }

    // Ekranın en yüksek yenileme hızı (90, 120, 144 Hz): bazı telefonlar uygulamaları istemedikçe 60 Hz'de tutar ve
    // sürüklenen parça parmağı geriden izler. Aynı çözünürlükteki en hızlı ekran kipi istenir; pil tasarrufu ya da
    // kullanıcının ekran ayarı (ör. 60 Hz) yine önceliklidir, sistem gerekirse düşürür.
    private void enYuksekYenilemeHizi() {
        try {
            Display ekran = Build.VERSION.SDK_INT >= Build.VERSION_CODES.R ? getDisplay() : getWindowManager().getDefaultDisplay();
            if (ekran == null) return;
            Display.Mode simdiki = ekran.getMode(), enIyi = simdiki;
            for (Display.Mode m : ekran.getSupportedModes()) {
                if (m.getPhysicalWidth() == simdiki.getPhysicalWidth() && m.getPhysicalHeight() == simdiki.getPhysicalHeight()
                        && m.getRefreshRate() > enIyi.getRefreshRate() + 0.5f) {
                    enIyi = m;
                }
            }
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            if (lp.preferredDisplayModeId != enIyi.getModeId()) {
                lp.preferredDisplayModeId = enIyi.getModeId();
                getWindow().setAttributes(lp);
            }
        } catch (RuntimeException e) {
            // Ekran bilgisi alınamadı: sistemin seçtiği yenileme hızı kalır
        }
    }
}
