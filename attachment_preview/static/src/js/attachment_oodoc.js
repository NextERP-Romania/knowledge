odoo.define("attachment_preview/static/src/js/attachment_oodoc.js", function(require) {
	"use strict";
	var viewrJS_mimemime_type = [
						'application/vnd.oasis.opendocument.text',
						'application/vnd.oasis.opendocument.spreadsheet',
						'application/vnd.oasis.opendocument.presentation',
						];
	const { clear } = require('mail/static/src/model/model_field_command.js');
	
	const {registerInstancePatchModel,} = require('mail/static/src/model/model_core.js');
	registerInstancePatchModel('mail.attachment', 'attachment_preview/static/src/js/attachment_oodoc.js', {

        /**
         * @private
         * @returns {boolean}
         */
        _computeIsViewable() {
			var is_view = (
                this.mediaType === 'image' ||
                this.mediaType === 'video' ||
                this.mimetype === 'application/pdf' ||
// added by NextERP 
			viewrJS_mimemime_type.includes(this.mimetype) ||
// /added by NextERP 
                this.isTextFile
            )            
			return is_view;
			},
		        /**
         * @private
         * @returns {string|undefined}
         */
        _computeDefaultSource() {
// added by NextERP  
		 if ( this.fileType && viewrJS_mimemime_type.includes(this.fileType)) {
			var returned_link = `/attachment_preview/static/lib/ViewerJS/index.html?title=${encodeURIComponent(this.name)}#`+`/web/content/${this.id}?model%3Dir.attachment`;
			console.log(`\n\nLINK returned_link=${returned_link} \n\n`)
			return returned_link;}
// added by NextERP 
	
            if (this.fileType === 'image') {
                return `/web/image/${this.id}?unique=1&amp;signature=${this.checksum}&amp;model=ir.attachment`;
            }
            if (this.fileType === 'application/pdf') {
            return `/web/static/lib/pdfjs/web/viewer.html?file=/web/content/${this.id}?model%3Dir.attachment`;
            }
            if (this.fileType && this.fileType.includes('text')) {
                return `/web/content/${this.id}?model%3Dir.attachment`;
            }
            if (this.fileType === 'youtu') {
                const urlArr = this.url.split('/');
                let token = urlArr[urlArr.length - 1];
                if (token.includes('watch')) {
                    token = token.split('v=')[1];
                    const amp = token.indexOf('&');
                    if (amp !== -1) {
                        token = token.substring(0, amp);
                    }
                }
                return `https://www.youtube.com/embed/${token}`;
            }
            if (this.fileType === 'video') {
                return `/web/image/${this.id}?model=ir.attachment`;
            }
            return clear(); },

        /**
         * @private
         * @returns {string|undefined}
         */
        _computeFileType() {
			console.log(`this.id=${this.id} this.type=${this.type} `)
            if (this.type === 'url' && !this.url) {
                return clear();
            } else if (!this.mimetype) {
                return clear();
            }
// added by NextERP 
//            const match = this.type === 'url'
//                ? this.url.match('(youtu|.png|.jpg|.gif)')
//                : this.mimetype.match('(image|video|application/pdf|text)');
            const match = this.type === 'url'
                ? this.url.match('(youtu|.png|.jpg|.gif)')
                : this.mimetype.match('('+ (['image|video|application/pdf|text'].concat(viewrJS_mimemime_type)).join('|')+')');
// /added by NextERP 
            if (!match) {
                return clear();
            }
            if (match[1].match('(.png|.jpg|.gif)')) {
                return 'image';
            }
			console.log(`retuned ${match[1]} \n match[0]=${match[0]}`)
            return match[1];
        },

        /**
         * @private
         * @returns {boolean}
         */
        _computeIsTextFile() {

            if (!this.fileType) {
                return false;
            }
// added by NextERP 
      //  return this.fileType.includes('text');    
		return this.fileType.includes('text')|| viewrJS_mimemime_type.includes(this.mimetype);
// /added by NextERP 
        }
     })

})
	

	

