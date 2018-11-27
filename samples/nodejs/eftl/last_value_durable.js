/*
 * Copyright (c) 2013-$Date: 2017-09-06 11:06:54 -0700 (Wed, 06 Sep 2017) $ TIBCO Software Inc.
 * Licensed under a BSD-style license. Refer to [LICENSE]
 * For more information, please contact:
 * TIBCO Software Inc., Palo Alto, California, USA
 */

'use strict'

const eFTL = require('eftl');
const fs = require('fs');

console.log(eFTL.getVersion());

// Set the server certificate chain for secure connections.
// Self-signed server certificates are not supported.
// If not set the eFTL client will trust any server certificate.
//
//eFTL.setTrustCertificates(fs.readFileSync('./ca.pem'));

// Start a connection to the eFTL server.
//
// The username and password are required when connecting
// to an eFTL server that has been configured for JAAS.
//
// The onConnect function is invoked following a successful
// connection to the eFTL server.
//
// The onDisconnect function is invoked following a failed
// connection attempt to the eFTL server.
//
eFTL.connect('ws://localhost:9191/channel', {
    username: undefined,
    password: undefined,
    onConnect: connection => {
        console.log('Connected to eFTL server');
        subscribe(connection);
    },
    onDisconnect: (connection, code, reason) => {
        console.log('Disconnected from eFTL server: ' + reason);
    }
});

// Subscribe to eFTL messages using a last-value durable subscription.
//
// This subscription defines a matcher that will match published 
// messages with a '_dest' field set to 'sample'.
//
// The durable name is used to create a durable subscription. The
// type specifies a last-value durable subscription. The key
// defines on which field in the matcher the messages will be sorted.
//
// The onSubscribe function is invoked following a successful
// subscription.
//
// The onError function is invoked following a failed subscription.
//
// the onMessage function is invoked whenever a published message
// is received by the subscription.
//
function subscribe(connection) {
    connection.subscribe({
        matcher: `{"_dest":"sample"}`,
        durable: 'sample-last-value',
        type: 'last-value',
        key: '_dest',
        onSubscribe: id => {
            console.log('Subscribed');
        },
        onError: (id, code, reason) => {
            console.log('Subscription failed: ' + reason);
        },
        onMessage: message => {
            console.log('Received message: ' + message.toString());
        }
    });
}
