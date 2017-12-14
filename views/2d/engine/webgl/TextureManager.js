// COPYRIGHT © 2017 Esri
//
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
//
// This material is licensed for use under the Esri Master License
// Agreement (MLA), and is bound by the terms of that agreement.
// You may redistribute and use this code without modification,
// provided you adhere to the terms of the MLA and include this
// copyright notice.
//
// See use restrictions at http://www.esri.com/legal/pdfs/mla_e204_e300/english
//
// For additional information, contact:
// Environmental Systems Research Institute, Inc.
// Attn: Contracts and Legal Services Department
// 380 New York Street
// Redlands, California, USA 92373
// USA
//
// email: contracts@esri.com
//
// See http://js.arcgis.com/4.6/esri/copyright.txt for details.

define(["require","exports","dojo/Deferred","../../../../core/promiseUtils","../../../3d/support/imageUtils","./SpriteMosaic","./Utils","./CIMSymbolHelper","./SDFHelper","./GlyphSource","./GlyphMosaic"],function(e,t,r,i,s,a,n,o,p,l,u){var h=[],c=function(){function e(){this._rasterizeQueue=new Map,this._spriteMosaic=new a(1024,1024,250),this._glyphSource=new l("https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer/resources/fonts/{fontstack}/{range}.pbf"),this._glyphMosaic=new u(1024,1024,this._glyphSource)}return Object.defineProperty(e.prototype,"sprites",{get:function(){return this._spriteMosaic},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"glyphs",{get:function(){return this._glyphMosaic},enumerable:!0,configurable:!0}),e.prototype.processItems=function(e){var t=this;if(e.done)return!1;for(;this._spriteMosaic.hasItemsToProcess();)this._spriteMosaic.processNextItem();this._rasterizeQueue.forEach(function(r,i){if(e.done)return!1;var s=t._rasterizeJSON(i);r.resolve(s),h.push(i)});for(var r=0,i=h;r<i.length;r++){var s=i[r];this._rasterizeQueue["delete"](s)}return h.length=0,!0},e.prototype.rasterizeItem=function(e,t){return void 0===t&&(t=null),e?!e.type||"text"!==e.type&&"esriTS"!==e.type?this._rasterizeSpriteSymbol(e).then(function(e){return{spriteMosaicItem:e}}):this._rasterizeTextSymbol(e,t).then(function(e){return{glyphMosaicItems:e}}):i.resolve(null)},e.prototype.bindSpritePage=function(e,t,r,i){i||(i=9729),this._spriteMosaic.bind(e,i,t,r)},e.prototype.bindGlyphsPage=function(e,t,r){this._glyphMosaic.bind(e,9729,t,r)},e.prototype._rasterizeTextSymbol=function(e,t){return this._glyphMosaic.getGlyphItems(e,t)},e.prototype._rasterizeSpriteSymbol=function(e){var t=this;if((n.isFillSymbol(e)||n.isLineSymbol(e))&&("solid"===e.style||"esriSFSSolid"===e.style||"esriSLSSolid"===e.style||"none"===e.style))return i.resolve(null);if(this._spriteMosaic.has(e))return i.resolve(this._spriteMosaic.getSpriteItem(e));if(e.url||e.imageData){var r=e.url?e.url:"data:"+e.contentType+";base64,"+e.imageData;return s.requestImage(r).then(function(r){return t._rasterizeResource(r).then(function(r){return t._addItemToMosaic(e,r.size,r.anchor,r.image,!n.isMarkerSymbol(e),r.sdf)})})}return this._rasterizeResource(e).then(function(r){return t._addItemToMosaic(e,r.size,r.anchor,r.image,!n.isMarkerSymbol(e),r.sdf)})},e.prototype._rasterizeResource=function(e){var t=this;if(this._rasterizeQueue.has(e))return this._rasterizeQueue.get(e).promise;var i=new r(function(){t._rasterizeQueue.has(e)&&t._rasterizeQueue["delete"](e)});if(e instanceof HTMLImageElement){this._rasterizationCanvas||(this._rasterizationCanvas=document.createElement("canvas"));var s=e;this._rasterizationCanvas.width=s.width,this._rasterizationCanvas.height=s.height;var a=this._rasterizationCanvas.getContext("2d");a.drawImage(s,0,0,s.width,s.height);for(var n=a.getImageData(0,0,s.width,s.height),o=new Uint8Array(n.data),p=void 0,l=0;l<o.length;l+=4)p=o[l+3]/255,o[l]=o[l]*p,o[l+1]=o[l+1]*p,o[l+2]=o[l+2]*p;i.resolve({size:[s.width,s.height],anchor:[0,0],image:new Uint32Array(o.buffer),sdf:!1})}else{var u=this._rasterizeJSON(e);i.resolve(u)}return i.promise},e.prototype._addItemToMosaic=function(e,t,r,i,s,a){return this._spriteMosaic.addSpriteItem(e,t,r,i,s,a)},e.prototype._rasterizeJSON=function(e){if(this._rasterizationCanvas||(this._rasterizationCanvas=document.createElement("canvas")),"simple-fill"===e.type||"esriSFS"===e.type){var t=o.SymbolHelper.rasterizeSimpleFill(this._rasterizationCanvas,e.style),r=t[0],i=t[1],s=t[2];return{size:[i,s],anchor:[0,0],image:new Uint32Array(r.buffer),sdf:!1}}if("simple-line"===e.type||"esriSLS"===e.type){var a=o.SymbolHelper.rasterizeSimpleLine(this._rasterizationCanvas,e.style),r=a[0],i=a[1],s=a[2];return{size:[i,s],anchor:[0,0],image:new Uint32Array(r.buffer),sdf:!0}}var n,l;if("simple-marker"===e.type||"esriSMS"===e.type?(n=o.CIMSymbolHelper.fromSimpleMarker(e),l=!0):(n=e,l=p.SDFHelper.checkSDF(n)),l){var u=new p.SDFHelper,h=u.buildSDF(n),r=h[0],c=h[1],f=h[2];return{size:[c,f],anchor:[0,0],image:new Uint32Array(r.buffer),sdf:!0}}var m=o.CIMSymbolHelper.rasterize(this._rasterizationCanvas,n),r=m[0],i=m[1],s=m[2],y=m[3],d=m[4];return{size:[i,s],anchor:[y,d],image:new Uint32Array(r.buffer),sdf:!1}},e}();return c});