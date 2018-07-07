// (function () {
//     "use strict";

//     $(document).ready(function () {

//         var items= function(done){
//             var result = [];
//             for (var i = 1; i < 200; i++) {
//                 result.push(i);
//             }
//             done(result);
//          }

//         $('#pagination-container').pagination({
//             dataSource: items,
//             pageSize: 5,//items each page contain
//             autoHidePrevious: true,
//             autoHideNext: true,
//             /*
//             callback: function(data, pagination) {
//                 // template method of yourself
//                 var html = template(data);
//                 dataContainer.html(html);
//             }
//             */
//         })



//     });

// })();