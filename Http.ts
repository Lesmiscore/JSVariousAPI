class Http {
    public static getResp(url: string): string {
        var urlO = new (eval("java.net.URL"))(url);
        var con = urlO.openConnection();
        var reader = new (eval("java.io.InputStreamReader"))(con.getInputStream(), "UTF-8");
        var data = new (eval("java.io.StringWriter"))();
        var buf = eval("java.lang.reflect.Array.newInstance")(eval("java.lang.Character.TYPE"), 4096);
        while (true) {
            var r = reader.read(buf);
            if (r <= 0) break;
            data.write(buf, 0, r);
        }
        return data.toString();
    }
    public static postResp(url: string, send: string):string {
        var urlO = new (eval("java.net.URL"))(url);
        var con = urlO.openConnection();
        con.setDoOutput(true);
        con.setRequestMethod("POST");
        var writer = new (eval("java.io.OutputStreamWriter"))(con.getOutputStream(), "UTF-8");
        writer.write(send);
        writer.flush();

        var reader = new (eval("java.io.InputStreamReader"))(con.getInputStream(), "UTF-8");
        var data = new (eval("java.io.StringWriter"))();
        var buf = eval("java.lang.reflect.Array.newInstance")(eval("java.lang.Character.TYPE"), 4096);
        while (true) {
            var r = reader.read(buf);
            if (r <= 0) break;
            data.write(buf, 0, r);
        }
        return data.toString();
    }
}