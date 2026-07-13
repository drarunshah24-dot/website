const { execSync } = require('child_process');

// When OpenNext triggers the build script internally, we must break the recursion
// and run the standard Next.js build.
if (process.env.SKIP_OPEN_NEXT_RECURSION) {
    console.log("Internal OpenNext build step detected. Running Next.js build...");
    execSync('npx next build', { stdio: 'inherit' });
    process.exit(0);
}

// Check if we're building on Vercel
if (process.env.VERCEL) {
    console.log("Vercel environment detected. Running Next.js build...");
    execSync('npx next build', { stdio: 'inherit' });
} else {
    // We assume any other environment (like Cloudflare CI) wants the OpenNext build.
    // We set the recursion-breaking flag so the internal build triggers next build instead of looping.
    console.log("Running OpenNext Cloudflare build...");
    execSync('npx opennextjs-cloudflare build', { 
        stdio: 'inherit', 
        env: { ...process.env, SKIP_OPEN_NEXT_RECURSION: '1' } 
    });
}
