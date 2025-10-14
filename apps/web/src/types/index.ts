export type Client={id:string;name:string;website?:string;email?:string;phone?:string;notes?:string;tags?:string[]};
export type Message={id:string;clientId:string;channel:'email'|'sms'|'whatsapp'|'call';direction:'in'|'out';body:string;createdAt:string};
