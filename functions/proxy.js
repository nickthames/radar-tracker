{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const fetch = require('node-fetch');\
\
exports.handler = async function(event, context) \{\
  try \{\
    // Only allow POST requests\
    if (event.httpMethod !== 'POST') \{\
      return \{\
        statusCode: 405,\
        body: JSON.stringify(\{ error: 'Method Not Allowed' \}),\
      \};\
    \}\
\
    const body = JSON.parse(event.body);\
    const response = await fetch('https://script.google.com/macros/s/AKfycbxQoQol1G4TqohtXdb9a9EnnA0toLEYn4gGMg4wqLAJfdvDht5ItbJFwZBffNE85UbE/exec', \{\
      method: 'POST',\
      body: JSON.stringify(body),\
      headers: \{ 'Content-Type': 'application/json' \},\
    \});\
\
    const data = await response.json();\
    return \{\
      statusCode: 200,\
      body: JSON.stringify(data),\
    \};\
  \} catch (error) \{\
    console.error('Proxy error:', error);\
    return \{\
      statusCode: 500,\
      body: JSON.stringify(\{ error: error.message \}),\
    \};\
  \}\
\};}