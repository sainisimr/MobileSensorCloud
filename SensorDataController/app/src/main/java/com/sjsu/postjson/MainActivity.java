package com.sjsu.postjson;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.logging.Handler;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import android.app.Activity;

public class MainActivity extends Activity implements OnClickListener {

    TextView location, ozoneData, ppmData, so2Data, coData, n2oData ,locationLat, locationLong;
    Button btnPost;
    static  final int[] ozone = {115,110,108,107,102,101,104,101,96,96,100,104,102,99,101};
    static  final int[] ppm = {88,86,83,82,80,84,79,74,74,79,80,83,86,91,93};
    static  final int[] co = {42,43,46,47,49,50,53,48,43,42,42,43,45,50,51};
    static  final int[] so2 = {47,42,42,45,40,36,32,30,34,31,29,30,34,39,35};
    static  final int[] n2o = {73,70,65,60,63,68,70,72,69,71,74,75,73,69,64};
    static  final String sensor_Id = "1016";
    static final String city = "San Diego";
    static final String longitude = "117°09′26″ W";
    static final String latitude = "32°42′55″ N ";




    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);

        location = (TextView) findViewById(R.id.tvLocationResult);
        ppmData = (TextView) findViewById(R.id.tvPPMResult);
        so2Data = (TextView) findViewById(R.id.tvSO2Result);
        coData = (TextView) findViewById(R.id.tvCOResult);
        ozoneData = (TextView) findViewById(R.id.tvOzoneResult);
        n2oData = (TextView) findViewById(R.id.tvN2OResult);
        locationLat = (TextView) findViewById(R.id.tvLatitudeResult);
        locationLong = (TextView) findViewById(R.id.tvLongitudeResult);

        location.setText(city);
        locationLat.setText(latitude);
        locationLong.setText(longitude);
        ppmData.setText(String.valueOf(ppm[0]));
        so2Data.setText(String.valueOf(so2[0]));
        coData.setText(String.valueOf(co[0]));
        ozoneData.setText(String.valueOf(ozone[0]));
        n2oData.setText(String.valueOf(n2o[0]));


        // add click listener to Button "POST"
        btnPost = (Button) findViewById(R.id.tvPost);
        btnPost.setOnClickListener(this);
    }
    public String POST(String url){
        /*String result = "";




        InputStream inputStream = null;

        try {

            // 1. create HttpClient
            HttpClient httpclient = new DefaultHttpClient();

            // 2. make POST request to the given URL
            HttpPost httpPost = new HttpPost(url);

            String json = "";
            int i = 0;
            // 3. build jsonObject

            while(i<15) {

                JSONObject jsonObject = new JSONObject();

                jsonObject.accumulate("Sensor_Id", sensor_Id);
                jsonObject.accumulate("Location", city);
                jsonObject.accumulate("Latitude", latitude);
                jsonObject.accumulate("Longitude", longitude);
                jsonObject.accumulate("Ozone", ozone[i]);
                jsonObject.accumulate("PPM", ppm[i]);
                jsonObject.accumulate("SO2", so2[i]);
                jsonObject.accumulate("N20", n2o[i]);
                jsonObject.accumulate("CO", co[i]);
                // 4. convert JSONObject to JSON to String
                json = jsonObject.toString();
                Log.e("Parmaters No: "+i, json);

                // 5. set json to StringEntity
                StringEntity se = new StringEntity(json);

                // 6. set httpPost Entity
                httpPost.setEntity(se);

                // 7. Set some headers to inform server about the type of the content
                  httpPost.setHeader("Accept", "application/json");
                httpPost.setHeader("Content-type", "application/json");*/


                Runnable runnable = new Runnable() {
                    @Override
                    public void run() {
                        for (int j = 0; j < 15; j++) {
                            final int i = j;
                            try {
                                Thread.sleep(3000);
                            } catch (InterruptedException e) {

                                Log.e("Exiting after",String.valueOf(j));
                                e.printStackTrace();
                            }
                            try {
                                // 1. create HttpClient
                                HttpClient httpclient = new DefaultHttpClient();

                                // 2. make POST request to the given URL

                                HttpPost httpPost = new HttpPost("http://52.34.33.7:8080/vendor");
                                //HttpPost httpPost = new HttpPost("http://10.0.0.7:8600/vendor");
                                String result = "";
                                InputStream inputStream = null;
                                JSONObject jsonObject = new JSONObject();

                                jsonObject.accumulate("Sensor_Id", sensor_Id);
                                jsonObject.accumulate("Location", city);
                                jsonObject.accumulate("Latitude", latitude);
                                jsonObject.accumulate("Longitude", longitude);
                                jsonObject.accumulate("Ozone", ozone[i]);
                                jsonObject.accumulate("PPM", ppm[i]);
                                jsonObject.accumulate("SO2", so2[i]);
                                jsonObject.accumulate("N2O", n2o[i]);
                                jsonObject.accumulate("CO", co[i]);
                                // 4. convert JSONObject to JSON to String
                                String json = "";
                                json = jsonObject.toString();
                                Log.e("Parmaters No: " + (i+1), json);
                                // 5. set json to StringEntity
                                StringEntity se = new StringEntity(json);

                                // 6. set httpPost Entity
                                httpPost.setEntity(se);

                                // 7. Set some headers to inform server about the type of the content
                                httpPost.setHeader("Accept", "application/json");
                                httpPost.setHeader("Content-type", "application/json");

                                location.post(new Runnable() {
                                    @Override
                                    public void run() {
                                        location.setText(city);

                                    }
                                });

                                locationLat.post(new Runnable() {
                                    @Override
                                    public void run() {
                                        locationLat.setText(latitude);

                                    }
                                });

                                locationLong.post(new Runnable() {
                                    @Override
                                    public void run() {
                                        locationLong.setText(longitude);

                                    }
                                });

                                ppmData.post(new Runnable() {
                                    @Override
                                    public void run() {
                                        ppmData.setText(String.valueOf(ppm[i]));

                                    }
                                });

                                so2Data.post(new Runnable() {
                                    @Override
                                    public void run() {
                                        so2Data.setText(String.valueOf(so2[i]));

                                    }
                                });

                                coData.post(new Runnable() {
                                    @Override
                                    public void run() {
                                        coData.setText(String.valueOf(co[i]));

                                    }
                                });


                                ozoneData.post(new Runnable() {
                                    @Override
                                    public void run() {
                                        ozoneData.setText(String.valueOf(ozone[i]));

                                    }
                                });


                                n2oData.post(new Runnable() {
                                    @Override
                                    public void run() {
                                        n2oData.setText(String.valueOf(n2o[i]));

                                    }
                                });
                                HttpResponse httpResponse = httpclient.execute(httpPost);

                                // 9. receive response as inputStream
                                inputStream = httpResponse.getEntity().getContent();

                                // 10. convert inputstream to string
                                if (inputStream != null)
                                    result = convertInputStreamToString(inputStream);
                                else
                                    result = "Did not work!";

                            }
                            catch (Exception e) {
                                Log.d("InputStream", e.getLocalizedMessage());
                            }
                        }
                    }

                };
                new Thread(runnable).start();
                //location.setText(city);
                /*locationLat.setText(latitude);
                locationLong.setText(longitude);
                ppmData.setText(String.valueOf(ppm[i]));
                so2Data.setText(String.valueOf(so2[i]));
                coData.setText(String.valueOf(co[i]));
                ozoneData.setText(String.valueOf(ozone[i]));
                n2oData.setText(String.valueOf(n2o[i]));
*/
                // 8. Execute POST request to the given URL
               /* HttpResponse httpResponse = httpclient.execute(httpPost);

                // 9. receive response as inputStream
                inputStream = httpResponse.getEntity().getContent();

                // 10. convert inputstream to string
                if (inputStream != null)
                    result = convertInputStreamToString(inputStream);
                else
                    result = "Did not work!";

                i++;
            }
        } catch (Exception e) {
            Log.d("InputStream", e.getLocalizedMessage());
        }
*/
        // 11. return result


        return "";
    }


    @Override
    public void onClick(View view) {

        switch(view.getId()){
            case R.id.tvPost:

                new HttpAsyncTask().execute("http://10.0.0.7:3000");
                break;
        }

    }
    private class HttpAsyncTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {



            return POST(urls[0]);
        }
        // onPostExecute displays the results of the AsyncTask.
        @Override
        protected void onPostExecute(String result) {
            Toast.makeText(getBaseContext(), "Data Sent!", Toast.LENGTH_LONG).show();
        }
    }

    public void setViewText(){

    }
    private static String convertInputStreamToString(InputStream inputStream) throws IOException{
        BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(inputStream));
        String line = "";
        String result = "";
        while((line = bufferedReader.readLine()) != null)
            result += line;

        inputStream.close();
        return result;

    }
}