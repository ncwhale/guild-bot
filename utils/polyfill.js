function base64url_polyfill() {
  Buffer.prototype.toBase64url = function () {
    return this.toString('base64').replace(/[\+\/]/g, x => { return x == '+' ? '-' : '_' })
  }
}

// TODO: detect if polyfill is needed.
var need_polyfill = true

if(need_polyfill){
  base64url_polyfill();
  need_polyfill = false
}