import wehelpjs from 'wehelpjs';

if(typeof window !== 'undefined'){
	window.wehelpjs = wehelpjs
	window.wehelpjs.api.setOptions({ url: process.env.API_URL });
} else if(typeof global !== 'undefined'){
	global.wehelpjs = wehelpjs
	global.wehelpjs.api.setOptions({ url: process.env.API_URL });
}

