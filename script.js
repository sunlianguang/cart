var addEvent = function (el, type, fn) {
    if (el.addEventListener) {
        el.addEventListener(type, fn, false);
    } else {
        el['e'+fn] = function () {
            fn.call(el, window.event);
        }
        el.attachEvent('on'+type, el['e'+fn]);
    }
}

var $ = function (className) {
    return document.querySelector(className);
}

var $$ = function (className) {
    return document.querySelectorAll(className);

}

var create = function (eleName) {
    return document.createElement(eleName);
}

window.onload = function () {
    var cart = {
        bookArr: [],
        imgList: $('.commodity').children,
        bookList: $('.info').firstElementChild,
        totalSelectBtn: $('.total-select'),
        totalNumber: $('.total-number').firstElementChild.firstElementChild,
        totalPrice: $('.total-price').firstElementChild,
        add: function (bookID, imgSrc, bookName, bookColor, bookPrice, bookTotalPrice) {
            var that = this;
            var f = 1;
            for (var i = 0; i < this.bookList.children.length; ++i) {
                if (this.bookList.children[i].getAttribute('book-id') === bookID) {
                    f = 0;
                    var oNumber = parseFloat($$('.book-number')[i].children[1].value),
                        oPrice = parseFloat($$('.book-price')[i].innerHTML);
                    //数目加1
                    $$('.book-number')[i].children[1].value = ++oNumber;
                    //书的总价格
                    $$('.book-price-total')[i].innerHTML = (oNumber * oPrice).toFixed(2);
                    this.bookArr[bookID-1].bookNumber = oNumber;
                    this.bookArr[bookID-1].bookTotalPrice = (oNumber * oPrice).toFixed(2);
                }
            }
            if(!f){
                return;
            }

            var info = {
                ul: that.bookList
            }

            //用appendChild()方法创建book列表
            var li = create("li");
            li.className = 'book';
            li.setAttribute('book-id', bookID);
            info.ul.appendChild(li);

            var divSelect = create('div'),
                checkInput = create('input');
            divSelect.className = 'book-select';
            checkInput.type = 'checkbox';
            divSelect.appendChild(checkInput);
            li.appendChild(divSelect);

            var divImg = create('div'),
                img = create('img');
            divImg.className = 'book-img';
            img.src = imgSrc;
            divImg.appendChild(img);
            li.appendChild(divImg);

            var divName = create('div');
            divName.className = 'book-name';
            divName.innerHTML = bookName;
            li.appendChild(divName);

            var divColor = create('div');
            divColor.className = 'book-color';
            divColor.innerHTML = bookColor;
            li.appendChild(divColor);

            var divPrice = create('div');
            divPrice.className = 'book-price';
            divPrice.innerHTML = bookPrice;
            li.appendChild(divPrice);

            var divNumber = create('div'),
                aMinus = create('a'),
                aInput = create('input'),
                aAdd = create('a');
            divNumber.className = 'book-number';
            aMinus.innerHTML = '-';
            aAdd.innerHTML = '+';
            aMinus.href = aAdd.href = 'javascript:;';
            aInput.type = 'text';
            aInput.value = 1;
            divNumber.appendChild(aMinus);
            divNumber.appendChild(aInput);
            divNumber.appendChild(aAdd);
            li.appendChild(divNumber);

            var divPriceTotal = create('div');
            divPriceTotal.className = 'book-price-total';
            divPriceTotal.innerHTML = bookTotalPrice;
            li.appendChild(divPriceTotal);

            var divDel = create('div'),
                aDel = create('a');
            divDel.className = 'book-del';
            aDel.href = 'javascript:;';
            aDel.innerHTML = '删除';
            divDel.appendChild(aDel);
            li.appendChild(divDel);

            //用innerHTML()方法创建book列表
            //var str = '';
            //str = '<li class="book" book-id="' + bookID + '">' +
            //        '<div class="book-select"><input type="checkbox"></div>' +
            //        '<div class="book-img"><img src="' + imgSrc + '" alt="' + bookName + '"/></div>' +
            //        '<div class="book-name">' + bookName + '</div>' +
            //        '<div class="book-color">' + bookColor + '</div>' +
            //        '<div class="book-price">' + bookPrice + '</div>' +
            //        '<div class="book-number"><a href="javascript:;">-</a><input type="text" value="1"/><a href="javascript:;">+</a></div>' +
            //        '<div class="book-price-total">' + bookTotalPrice + '</div>' +
            //        '<div class="book-del"><a href="javascript:;">删除</a></div>';
            //that.bookList.innerHTML += str;

            //创建数组，存储书的数据
            this.bookArr[bookID-1] = {
                bookName: bookName,
                bookColor: bookColor,
                bookPrice: bookPrice,
                bookNumber: 1,
                bookTotalPrice: bookTotalPrice,
            }
        },
        del: function (node) {
            node.parentNode.removeChild(node);
        },
        plus: function (target, price, totalPrice) {
            var number = target.value;
            target.value = number++;
            this.bookList.children[i].children[6].innerHTML = number * price;
        },
        minus: function (target, price, totalPrice) {
            var number = target.value;
            if (number >= 1) {
                target.value = number--;
                this.bookList.children[i].children[6].innerHTML = number * price;
            }
        },
        allPrice: function () {
            var s = 0;
            for (var i = 0; i < this.bookList.children.length; ++i) {
                if (this.bookList.children[i].firstElementChild.firstElementChild.checked) {
                    //s += parseFloat(this.bookList.children[i].children[6].innerHTML);
                    s += parseFloat(this.bookArr[i].bookTotalPrice);
                }
            }
            return s.toFixed(2);
        },
        allNumber: function () {
            var s = 0;
            for (var i = 0; i < this.bookList.children.length; ++i) {
                if (this.bookList.children[i].firstElementChild.firstElementChild.checked) {
                    //s += parseFloat(this.bookList.children[i].children[5].children[1].value);
                    s += parseFloat(this.bookArr[i].bookNumber);
                }
            }
            return s;
        },
        all: function () {
            this.totalNumber.innerHTML = this.allNumber();
            this.totalPrice.innerHTML = this.allPrice();
        },
        init: function () {
            var that = this;
            //从最上面图片列表添加购物车
            addEvent(that.imgList[0].parentNode, 'click', function (event) {
                event = event || window.event;
                var target = event.target || event.srcElement;
                if (target.tagName === 'IMG') {
                    var bookID = target.getAttribute('data-id'),
                        imgSrc = target.src,
                        bookName = target.getAttribute('data-name'),
                        bookColor = target.getAttribute('data-color'),
                        bookPrice = target.getAttribute('data-price'),
                        bookTotalPrice = bookPrice;
                    that.add(bookID, imgSrc, bookName, bookColor, bookPrice, bookTotalPrice);
                }
            });

            addEvent(that.bookList, 'click', function (event) {
                event = event || window.event;
                var target = event.target || event.srcElement,
                    selectNumber = 0;

                //点击选中按钮
                if (target.tagName === 'INPUT' && target.type === 'checkbox') {
                    if (parseFloat(that.totalNumber.innerHTML) + 1 === that.bookList.children.length) {
                        $('.total-select').firstElementChild.checked = 'checked';
                    } else {
                        $('.total-select').firstElementChild.checked = '';
                    }
                    that.all();
                }

                //点击 - ，减少件数
                if (target.tagName === 'A' && target.innerHTML === '-') {
                    if (target.nextSibling.value >= 1) {
                        target.nextSibling.value--;
                        target.parentNode.nextSibling.innerHTML = (target.nextSibling.value * target.parentNode.previousSibling.innerHTML).toFixed(2);
                        that.all();
                    }
                }

                //点击 * ，添加件数
                if (target.tagName === 'A' && target.innerHTML === '+') {
                    if (target.previousSibling.value <= 99) {
                        target.previousSibling.value++;
                        target.parentNode.nextSibling.innerHTML = (target.previousSibling.value * target.parentNode.previousSibling.innerHTML).toFixed(2);
                        that.all();
                    }
                }

                //点击‘删除’按钮
                if (target.tagName === 'A' && target.parentNode.className === 'book-del') {
                    if (that.bookList.children.length === 1) {
                        $('.total-select').firstElementChild.checked = '';
                    }
                    that.del(target.parentNode.parentNode);
                    that.all();
                }

                //输入商品件数
                if (target.tagName === 'INPUT' && target.parentNode.className === 'book-number') {
                    addEvent($('.book-number input'), 'input', function () {
                        if (this.value >= 1 && this.value <= 99) {
                            $('.book-price-total').innerHTML = (this.value * this.parentNode.previousSibling.innerHTML).toFixed(2);
                        } else {
                            this.value = 1;
                        }
                        that.all();
                    })
                }
            });

            //点击‘全选’按钮
            addEvent($('.total-select'), 'click', function (event) {
                event = event || window.event;
                var target = event.target || event.srcElement;
                if (target.checked) {
                    for (var i = 0; i < that.bookList.children.length; ++i) {
                        that.bookList.children[i].firstElementChild.firstElementChild.checked = 'checked';
                    }
                    that.all();
                } else {
                    for (var i = 0; i < that.bookList.children.length; ++i) {
                        that.bookList.children[i].firstElementChild.firstElementChild.checked = '';
                    }
                    that.all();
                }
            });
        }
}
    cart.init();
}