/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps, @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');

// When OpenNext triggers the build script internally, we must break the recursion
// and run the standard Next.js build.
if (process.env.SKIP_OPEN_NEXT_RECURSION) {
    console.log("Internal OpenNext build step detected. Running Next.js build...");
    execSync('npx next build', { stdio: 'inherit' });
    process.exit(0);
}

const isCloudflare = process.env.CF_PAGES === "1";

if (!isCloudflare) {
    console.log("Local build detected. Running Next.js build...");
    try {
        execSync("npx next build", { stdio: "inherit" });
    } catch (error) {
        console.error("Local Next.js build failed");
        process.exit(1);
    }
} else {
    // We assume any other environment (like Cloudflare CI) wants the OpenNext build.
    // We set the recursion-breaking flag so the internal build triggers next build instead of looping.
    console.log("Running OpenNext Cloudflare build...");
    execSync('npx opennextjs-cloudflare build', { 
        stdio: 'inherit', 
        env: { ...process.env, SKIP_OPEN_NEXT_RECURSION: '1' } 
    });
}
