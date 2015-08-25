class Music {
    private static system: string = Music.checkSystem();

    private musicObj;
    private path;
    public constructor(path: string) {
        this.musicObj = Music.newInstance(this.path = path);
    }
    private static newInstance(path: string): any {
        if (Music.system == "html5") {
            return new Audio(path);
        } else if (Music.system == "android") {
            var data = new (eval("android.media.MediaPlayer"))();
            data.setDataSource(path);
            data.prepare();
            return data;
        } else if (Music.system == "javax") {
            return new JavaXMediaPlayer(path);
        } else {
            throw new Error("Playing music on this environment is not supported.");
        }
    }
    private static checkSystem(): string {
        if (Audio) {
            return "html5";
        }
        function tfc(name: string): any {
            try {
                return eval("java.lang.Class.forName(\"" + name + "\")");
            } catch (e) {
                return null;
            }
        }
        if (tfc("android.media.MediaPlayer")) {
            return "android";
        }
        if (tfc("javax.sound.sampled.AudioSystem") & tfc("javax.sound.sampled.AudioInputStream") & tfc("javax.sound.sampled.SourceDataLine")) {
            return "javax";
        }
        return "unavaliable";
    }
    public play(): void {
        if (Music.system == "html5") {
            this.musicObj.play();
        } else if (Music.system == "android") {
            this.musicObj.play();
        } else if (Music.system == "javax") {
            this.musicObj.play();
        } else {
            throw new Error("Playing music on this environment is not supported.");
        }
    }
    public stop(): void {
        if (Music.system == "html5") {
            this.musicObj.pause();
            this.musicObj.currentTime = this.musicObj.seekable.start();
        } else if (Music.system == "android") {
            this.musicObj.pause();
            this.musicObj.seekTo(0);
        } else if (Music.system == "javax") {
            this.musicObj.stop();
        } else {
            throw new Error("Playing music on this environment is not supported.");
        }
    }
    public dispose(): void {
        if (Music.system == "html5") {
            this.musicObj.src = "";
        } else if (Music.system == "android") {
            this.musicObj.release();
        } else if (Music.system == "javax") {
            this.musicObj.exit();
        }
    }
    public isPlaying(): boolean {
        if (Music.system == "html5") {
            return void 0;
        } else if (Music.system == "android") {
            return this.musicObj.isPlaying();
        } else if (Music.system == "javax") {
            return this.musicObj.isUsed();
        } else {
            throw new Error("Playing music on this environment is not supported.");
        }
    }
}
/*Don't use this class directory. Use Music class instead.*/
/*from: http://ai-argument.hatenadiary.jp/entry/2013/02/14/211024 */
class JavaXMediaPlayer {
    private file: any;
    private in: any;
    private line: any;
    private frameSize: number;
    private buffer = eval("java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE,32*1024)"); // 32k is arbitrary
    private playThread: any;
    private playing: boolean;
    private notYetEOF: boolean;
    private readPoint: number = 0;
    private bytesRead: number = 0;
    private din: any = null;
    private decodedFormat: any;

    private static AudioSystem = eval("javax.sound.sampled.AudioSystem");
    private static AudioFormat = eval("javax.sound.sampled.AudioFormat");
    private static DataLine = eval("javax.sound.sampled.DataLine");
    constructor(f: any) {
        this.file = new (eval("java.io.File"))(f, "");
        this.in = JavaXMediaPlayer.AudioSystem.getAudioInputStream(this.file);
        var format = this.in.getFormat();
        this.decodedFormat = new JavaXMediaPlayer.AudioFormat(
            JavaXMediaPlayer.AudioFormat.Encoding.PCM_SIGNED,
            format.getSampleRate(),
            16,
            format.getChannels(),
            format.getChannels() * 2,
            format.getSampleRate(),
            false);
        this.din = JavaXMediaPlayer.AudioSystem.getAudioInputStream(this.decodedFormat, this.in);
        format = this.din.getFormat();
        var info = new JavaXMediaPlayer.DataLine.Info(eval("java.lang.Class.forName(\"javax.sound.sampled.SourceDataLine\")"), this.decodedFormat);
        this.line = JavaXMediaPlayer.AudioSystem.getLine(info);
        this.line.open();
        this.playThread = new (eval("java.lang.Thread"))(new (eval("java.lang.Runnable"))({ run: this.run() }));
        this.playing = false;
        this.notYetEOF = true;
        this.playThread.start();
    }
    private run(): void {
        this.readPoint = 0;
        this.bytesRead = 0;
        while (!0) {
            try {
                while (this.notYetEOF) {
                    if (this.playing) {
                        this.bytesRead = this.din.read(this.buffer, this.readPoint, this.buffer.length - this.readPoint);
                        if (this.bytesRead == -1) {
                            this.notYetEOF = false;
                            break;
                        }
                        var leftover = this.bytesRead % this.frameSize;
                        this.line.write(this.buffer, this.readPoint, this.bytesRead - leftover);
                        eval("java.lang.System.arraycopy")(this.buffer, this.bytesRead, this.buffer, 0, leftover);
                    } else {
                        eval("try{java.lang.Thread.sleep(10)}catch(e){}")
                    }
                }
                this.line.drain();
                this.line.stop();
                this.playing = false;
                this.notYetEOF = true;
                this.lineReset();
                this.suspend();
            } catch (e) {

            }
        }
    }
    public start() {
        this.playing = true;
        this.line.start();
        try {
            this.resume();
        } catch (e) {

        }
    }
    public contStart() {
        if (this.playing) {
            this.line.stop();
            this.line.flush();
            this.lineReset();
            this.line.start();
        } else {
            this.start();
        }
    }
    public stop() {
        this.playing = false;
        this.line.stop();
        this.line.flush();
        this.lineReset();
    }
    public lineReset() {
        try {
            this.in = JavaXMediaPlayer.AudioSystem.getAudioInputStream(this.file);
            this.din = JavaXMediaPlayer.AudioSystem.getAudioInputStream(this.decodedFormat, this.in);
        } catch (e) {
        }
    }
    public suspend() {
        this.playThread.wait();
    }
    public resume() {
        this.playThread.notify();
    }
    public exit() {
        this.line.stop();
        this.line.close();
    }
    public isUsed() {
        return this.playing;
    }
}