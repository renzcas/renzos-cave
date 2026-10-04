export const Modes = {
    current: "recon",

    switch(mode) {
        this.current = mode;
        console.log("Mode switched to:", mode);
    }
};
