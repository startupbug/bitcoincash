var TestimonialItem = function (avatar, title, text, rating, name) {
    if(angular.isDefined(avatar)) {
        this.avatar = avatar;
    } else {
        throw new Error("Avatar is required.")
    }
    if(angular.isDefined(title)) {
        this.title = title;
    } else {
        throw new Error("Title is required.")
    }
    if(angular.isDefined(text)) {
        this.text = text;
    } else {
        throw new Error("Text is required.")
    }
    if (angular.isDefined(rating)) {
        this.rating = rating;
    } else {
        throw new Error("Rating is required.")
    }
    if(angular.isDefined(name)) {
        this.name = name;
    } else {
        throw new Error("Name is required.")
    }
}
TestimonialItem.prototype.constructor = TestimonialItem;


(function () {
    'use strict';

    angular
        .module("app")
        .controller("SliderController", SliderController);

    SliderController.$inject = [];

    function SliderController() {
        var vm = this;
        vm.hideSlider = false;
        vm.showControls = true;

        vm.testimonials = [
            new TestimonialItem('AdamBellichek', 'Get on the ICE9 Hype Train', "Everyone is sharing the #ice9tech wealth. Cashed $3,400 in pure profit in 11 days. Time to spread the message #ice9tech #jointherevolution", 5, 'Adam Bellichek, Twitter'),
            new TestimonialItem('CollinYarnell', 'Join The ICE9 Revolution', "Seriously, #ice9tech rocks!! Spread the word and grow your bank account!! Here’s to $6648 profit after my first week. #winning", 5, 'Collin Yarnell, Twitter'),
            new TestimonialItem('LaurenManzano', 'Highly Recommended', "Just finished testing out ICE9 and it’s the real deal. Easily the best experience trading from home that I’ve ever had. $1,100 in 3 days is incredible!", 5, 'Lauren Manzano, Instagram'),
            new TestimonialItem('BrettAndrofsky', 'Everything you could hope for', "Christmas came early this year, ICE 9 is an absolute MIRACLE!! Share to win, and join the ICE9 Revolution, you’ll thank me when you do!", 5, 'Brett Androfsky, Instagram'),
        ];

        vm.initializeSlider = function (testimonialsArray) {
                
            if (testimonialsArray instanceof Array) {
                if (testimonialsArray.length > 1) {
                    vm.selectedTestimonial = testimonialsArray[1];
                } else if (testimonialsArray.length > 0) {
                    vm.selectedTestimonial = testimonialsArray[0];
                } else {
                    vm.hideSlider = true;
                }
                if (testimonialsArray.length <= 2) {
                    vm.showControls = false;
                }
            } else {
                vm.hideSlider = true;
                vm.showControls = false;
                throw new TypeError("Testimonials collection should be of type 'Array'.");
            }
        }

        vm.initializeSlider(vm.testimonials);

        vm.slideRight = function (array) {
            if (array instanceof Array) {
                array.push(array.shift());
                vm.selectedTestimonial = array[1];
            } else {
                vm.hideSlider = true;
                throw new TypeError("Testimonials collection should be of type 'Array'.");
            }
        }

        vm.slideLeft = function (array) {
            if (array instanceof Array) {
                array.unshift(array.pop());
                vm.selectedTestimonial = array[1];
            } else {
                vm.hideSlider = true;
                throw new TypeError("Testimonials collection should be of type 'Array'.");
            }
        }

    }
}());