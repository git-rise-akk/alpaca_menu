$(document).ready(() => {

    $('.hamburger__menu').on('click', function(){
        $('.menu__mobile').toggleClass('active');
        $('.wrapper__content').toggleClass('menu__open');
    });

    $('.menu__mobile .menu__link--submenu').on('click', function(){
        $(this).toggleClass('active');
        $('.submenu__container').toggleClass('active');
    });

    $('.menu__mobile .submenu--two').on('click', function(){
        $(this).toggleClass('active');
        $('.submenu__item__container').toggleClass('active');
    });

});
 