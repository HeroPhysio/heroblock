package tr.com.herouygulama.heroblock;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Kenardan kenara görünüm: oyun durum ve gezinme çubuklarının arkasına kadar uzanır, güvenli alanları kendisi bırakır
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
    }
}
