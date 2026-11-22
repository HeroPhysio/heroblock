package tr.com.herouygulama.heroblock;

import android.os.CancellationSignal;
import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.credentials.Credential;
import androidx.credentials.CredentialManager;
import androidx.credentials.CredentialManagerCallback;
import androidx.credentials.CustomCredential;
import androidx.credentials.GetCredentialRequest;
import androidx.credentials.GetCredentialResponse;
import androidx.credentials.exceptions.GetCredentialCancellationException;
import androidx.credentials.exceptions.GetCredentialException;
import androidx.credentials.exceptions.NoCredentialException;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption;
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential;
import java.util.regex.Pattern;

/**
 * "Hesabını Koru (Google ile Bağla)": Android Credential Manager ile Google'da oturum açılır, Google'ın verdiği kimlik
 * belgesi (ID token) oyuna döner. Oyun belgeyi skor sunucusuna gönderir; sunucu onu Google'a doğrulatır ve yalnızca Google
 * hesabının değişmez numarasını (sub) saklar. E-posta, ad ya da fotoğraf burada okunmaz ve saklanmaz.
 *
 * Oyun düğmeyi yalnızca sunucu bir Google istemci kimliği (OAuth "Web uygulaması" istemcisi) bildirdiğinde gösterir; kimlik
 * yoksa bu eklenti hiç çağrılmaz. JS: HBGoogle.girisYap({ istemci }) → { idToken }; vazgeçilirse kod "IPTAL".
 */
@CapacitorPlugin(name = "HBGoogle")
public class HBGooglePlugin extends Plugin {
    private static final Pattern ISTEMCI = Pattern.compile("^[0-9]+-[a-z0-9]+\\.apps\\.googleusercontent\\.com$");

    @PluginMethod
    public void girisYap(PluginCall call) {
        String istemci = call.getString("istemci", "");
        if (istemci == null || !ISTEMCI.matcher(istemci).matches()) {
            call.reject("Google istemci kimliği geçersiz", "GECERSIZ");
            return;
        }
        if (getActivity() == null) {
            call.reject("Uygulama penceresi hazır değil", "HATA");
            return;
        }
        // "Google ile oturum aç" düğmesine basıldığında açılan Google penceresi (cihazdaki hesaplar ya da yeni hesap)
        GetSignInWithGoogleOption secenek = new GetSignInWithGoogleOption.Builder(istemci).build();
        GetCredentialRequest istek = new GetCredentialRequest.Builder().addCredentialOption(secenek).build();
        CredentialManager yonetici = CredentialManager.create(getContext());
        yonetici.getCredentialAsync(getActivity(), istek, new CancellationSignal(), ContextCompat.getMainExecutor(getContext()),
            new CredentialManagerCallback<GetCredentialResponse, GetCredentialException>() {
                @Override
                public void onResult(GetCredentialResponse sonuc) {
                    Credential k = sonuc.getCredential();
                    if (k instanceof CustomCredential && GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL.equals(k.getType())) {
                        try {
                            GoogleIdTokenCredential g = GoogleIdTokenCredential.createFrom(k.getData());
                            JSObject o = new JSObject();
                            o.put("idToken", g.getIdToken());
                            call.resolve(o);
                        } catch (RuntimeException e) {
                            call.reject("Google yanıtı okunamadı", "HATA");
                        }
                    } else {
                        call.reject("Beklenmeyen oturum türü", "HATA");
                    }
                }

                @Override
                public void onError(@NonNull GetCredentialException e) {
                    if (e instanceof GetCredentialCancellationException) call.reject("Vazgeçildi", "IPTAL");
                    else if (e instanceof NoCredentialException) call.reject("Cihazda Google hesabı yok", "HESAP_YOK");
                    else call.reject("Google'da oturum açılamadı", "HATA");
                }
            });
    }
}
