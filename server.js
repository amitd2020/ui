const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');

function app() {
    
    const server = express();
    const distDir = path.join( process.cwd(), 'dist/dataGardener-cli' );
    
    server.set( 'views', distDir );
    server.use( bodyParser.json() );
    server.use( bodyParser.urlencoded( { extended: false } ) );
    server.use( compression() );
    
    server.get( '*.*', express.static( distDir, { maxAge: '1y' } ) );
    
    server.get( '*', ( req, res ) => {
        res.sendFile( path.join( distDir, 'index.html' ) );
    });

    return server;

}

function run() {
	const port = process.env['PORT'] || 4000;

	// Start up the Node server
	const server = app();

	server.listen(port, () => {
		console.log(`Node Express server listening on http://localhost:${port}`);
	});
}

run();
