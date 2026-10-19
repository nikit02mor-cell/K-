package com.physicssolver.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.window.OnBackInvokedDispatcher;
import android.view.WindowInsets;

public class MainActivity extends Activity {
    private static final int BG = Color.parseColor("#F2F5F9");
    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        web.setBackgroundColor(BG);
        // Фон окна нужен, чтобы под прозрачными системными панелями (Android 15+) был наш цвет.
        getWindow().getDecorView().setBackgroundColor(BG);
        setContentView(web);

        // На Android 15+ (targetSdk 35+) приложение рисуется под системными панелями,
        // поэтому вручную отодвигаем страницу на размер статус-бара и панели навигации.
        web.setOnApplyWindowInsetsListener((v, insets) -> {
            int left, top, right, bottom;
            if (Build.VERSION.SDK_INT >= 30) {
                Insets i = insets.getInsets(
                        WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                left = i.left; top = i.top; right = i.right; bottom = i.bottom;
            } else {
                left = insets.getSystemWindowInsetLeft();
                top = insets.getSystemWindowInsetTop();
                right = insets.getSystemWindowInsetRight();
                bottom = insets.getSystemWindowInsetBottom();
            }
            v.setPadding(left, top, right, bottom);
            return Build.VERSION.SDK_INT >= 30
                    ? WindowInsets.CONSUMED
                    : insets.consumeSystemWindowInsets();
        });

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // нужно для запоминания выбранного g и задачи
        s.setAllowFileAccess(true);

        // Внешние ссылки открываем в браузере, само приложение остаётся локальным.
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if ("file".equals(u.getScheme())) return false;
                startActivity(new Intent(Intent.ACTION_VIEW, u));
                return true;
            }
        });

        // Android 13+: «Назад» идёт через OnBackInvokedDispatcher (при targetSdk 36
        // onBackPressed() уже не вызывается).
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::handleBack);
        }

        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl("file:///android_asset/index.html");
    }

    private void handleBack() {
        if (web.canGoBack()) web.goBack(); else finish();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        // Android 12 и ниже.
        if (web.canGoBack()) web.goBack(); else super.onBackPressed();
    }
}
