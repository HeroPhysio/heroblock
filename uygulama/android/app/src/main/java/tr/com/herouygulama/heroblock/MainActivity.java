package tr.com.herouygulama.heroblock;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import androidx.activity.EdgeToEdge;
import androidx.activity.SystemBarStyle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
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
    }
}
