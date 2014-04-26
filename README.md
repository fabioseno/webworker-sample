webworker-sample
================

This sample shows the browser's max concurrent requests limitation using XHR.

The test presented the concurrent request limitation from both regular and web workers context and proved that even using web workers this limitation is still applied.

NOTE: the number of concurrent requests may vary from 2 to 9, depending on the browser and applies only to requests made to the same domain.
