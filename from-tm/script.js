document.addEventListener('DOMContentLoaded', function () {
    if ('onwheel' in document) {
        window.onwheel = function (event) {
            if (typeof (this.RDSmoothScroll) !== undefined) {
                try {
                    window.removeEventListener('DOMMouseScroll', this.RDSmoothScroll.prototype.onWheel);
                } catch (error) {
                }
                event.stopPropagation();
            }
        };
    } else if ('onmousewheel' in document) {
        window.onmousewheel = function (event) {
            if (typeof (this.RDSmoothScroll) !== undefined) {
                try {
                    window.removeEventListener('onmousewheel', this.RDSmoothScroll.prototype.onWheel);
                } catch (error) {
                }
                event.stopPropagation();
            }
        };
    }
    try {
        $('body').unmousewheel();
    } catch (error) {
    }
});

function include(url) {
    document.write('<script src="' + url + '"></script>');
    return false;
}

include('js/jquery.cookie.js');
include('js/device.min.js');
include('js/tmstickup.js');
$(window).load(function () {
    if ($('html').hasClass('desktop')) {
        $('#stuck_container').TMStickUp({})
    }
});
include('js/jquery.easing.1.3.js');
include('js/jquery.ui.totop.js');
$(function () {
    $().UItoTop({easingType: 'easeOutQuart'});
});
include('js/jquery.mousewheel.min.js');
include('js/jquery.simplr.smoothscroll.min.js');
$(function () {
    if ($('html').hasClass('desktop')) {
        $.srSmoothscroll({step: 150, speed: 800});
    }
});
var currentYear = (new Date).getFullYear();
$(document).ready(function () {
    $("#copyright-year").text((new Date).getFullYear());
});
include('js/superfish.js');
include('js/jquery.mobilemenu.js');
$(function () {
    var viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]'),
        ua = navigator.userAgent, gestureStart = function () {
            viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6, initial-scale=1.0";
        }, scaleFix = function () {
            if (viewportmeta && /iPhone|iPad/.test(ua) && !/Opera Mini/.test(ua)) {
                viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
                document.addEventListener("gesturestart", gestureStart, false);
            }
        };
    scaleFix();
    if (window.orientation != undefined) {
        var regM = /ipod|ipad|iphone/gi, result = ua.match(regM)
        if (!result) {
            $('.sf-menu li').each(function () {
                if ($(">ul", this)[0]) {
                    $(">a", this).toggle(function () {
                        return false;
                    }, function () {
                        window.location.href = $(this).attr("href");
                    });
                }
            })
        }
    }
});
var ua = navigator.userAgent.toLocaleLowerCase(), regV = /ipod|ipad|iphone/gi, result = ua.match(regV), userScale = "";
if (!result) {
    userScale = ",user-scalable=0"
}
document.write('<meta name="viewport" content="width=device-width,initial-scale=1.0' + userScale + '">');
$(document).ready(function () {
    var
        isNoviBuilder = false, plugins = {
            captcha: $('.recaptcha'),
            campaignMonitor: $('.campaign-mailform'),
            checkbox: $("input[type='checkbox']"),
            mailchimp: $('.mailchimp-mailform'),
            rdMailForm: $(".rd-mailform"),
            rdInputLabel: $(".form-label"),
            regula: $("[data-constraints]"),
            radio: $("input[type='radio']"),
            maps: $(".google-map-container")
        };

    function attachFormValidator(elements) {
        regula.custom({
            name: 'PhoneNumber', defaultMessage: 'Invalid phone number format', validator: function () {
                if (this.value === '') return true; else return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test(this.value);
            }
        });
        for (var i = 0; i < elements.length; i++) {
            var o = $(elements[i]), v;
            o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
            v = o.parent().find(".form-validation");
            if (v.is(":last-child")) o.addClass("form-control-last-child");
        }
        elements.on('input change propertychange blur', function (e) {
            var $this = $(this), results;
            if (e.type !== "blur") if (!$this.parent().hasClass("has-error")) return;
            if ($this.parents('.rd-mailform').hasClass('success')) return;
            if ((results = $this.regula('validate')).length) {
                for (i = 0; i < results.length; i++) {
                    $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error");
                }
            } else {
                $this.siblings(".form-validation").text("").parent().removeClass("has-error")
            }
        }).regula('bind');
        var regularConstraintsMessages = [{
            type: regula.Constraint.Required,
            newMessage: "The text field is required."
        }, {
            type: regula.Constraint.Email,
            newMessage: "The email is not a valid email."
        }, {
            type: regula.Constraint.Numeric,
            newMessage: "Only numbers are required"
        }, {type: regula.Constraint.Selected, newMessage: "Please choose an option."}];
        for (var i = 0; i < regularConstraintsMessages.length; i++) {
            var regularConstraint = regularConstraintsMessages[i];
            regula.override({constraintType: regularConstraint.type, defaultMessage: regularConstraint.newMessage});
        }
    }

    function isValidated(elements, captcha) {
        var results, errors = 0;
        if (elements.length) {
            for (var j = 0; j < elements.length; j++) {
                var $input = $(elements[j]);
                if ((results = $input.regula('validate')).length) {
                    for (k = 0; k < results.length; k++) {
                        errors++;
                        $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
                    }
                } else {
                    $input.siblings(".form-validation").text("").parent().removeClass("has-error")
                }
            }
            if (captcha) {
                if (captcha.length) {
                    return validateReCaptcha(captcha) && errors === 0
                }
            }
            return errors === 0;
        }
        return true;
    }

    function validateReCaptcha(captcha) {
        var captchaToken = captcha.find('.g-recaptcha-response').val();
        if (captchaToken.length === 0) {
            captcha.siblings('.form-validation').html('Please, prove that you are not robot.').addClass('active');
            captcha.closest('.form-wrap').addClass('has-error');
            captcha.on('propertychange', function () {
                var $this = $(this), captchaToken = $this.find('.g-recaptcha-response').val();
                if (captchaToken.length > 0) {
                    $this.closest('.form-wrap').removeClass('has-error');
                    $this.siblings('.form-validation').removeClass('active').html('');
                    $this.off('propertychange');
                }
            });
            return false;
        }
        return true;
    }

    function getLatLngObject(str, marker, map, callback) {
        var coordinates = {};
        try {
            coordinates = JSON.parse(str);
            callback(new google.maps.LatLng(coordinates.lat, coordinates.lng), marker, map)
        } catch (e) {
            map.geocoder.geocode({'address': str}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
                    callback(new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)), marker, map)
                }
            })
        }
    }

    window.onloadCaptchaCallback = function () {
        for (var i = 0; i < plugins.captcha.length; i++) {
            var $capthcaItem = $(plugins.captcha[i]);
            grecaptcha.render($capthcaItem.attr('id'), {
                sitekey: $capthcaItem.attr('data-sitekey'),
                size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
                theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
                callback: function (e) {
                    $('.recaptcha').trigger('propertychange');
                }
            });
            $capthcaItem.after("<span class='form-validation'></span>");
        }
    };
    if (plugins.maps.length) {
        $.getScript("//maps.google.com/maps/api/js?key=AIzaSyAwH60q5rWrS8bXwpkZwZwhw9Bw0pqKTZM&sensor=false&libraries=geometry,places&v=3.7", function () {
            var head = document.getElementsByTagName('head')[0], insertBefore = head.insertBefore;
            head.insertBefore = function (newElement, referenceElement) {
                if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') !== -1 || newElement.innerHTML.indexOf('gm-style') !== -1) {
                    return;
                }
                insertBefore.call(head, newElement, referenceElement);
            };
            var geocoder = new google.maps.Geocoder;
            for (var i = 0; i < plugins.maps.length; i++) {
                var zoom = parseInt(plugins.maps[i].getAttribute("data-zoom"), 10) || 11;
                var styles = plugins.maps[i].hasAttribute('data-styles') ? JSON.parse(plugins.maps[i].getAttribute("data-styles")) : [];
                var center = plugins.maps[i].getAttribute("data-center") || "New York";
                var map = new google.maps.Map(plugins.maps[i].querySelectorAll(".google-map")[0], {
                    zoom: zoom,
                    styles: styles,
                    scrollwheel: false,
                    center: {lat: 0, lng: 0}
                });
                plugins.maps[i].map = map;
                plugins.maps[i].geocoder = geocoder;
                plugins.maps[i].google = google;
                getLatLngObject(center, null, plugins.maps[i], function (location, markerElement, mapElement) {
                    mapElement.map.setCenter(location);
                })
                var markerItems = plugins.maps[i].querySelectorAll(".google-map-markers li");
                if (markerItems.length) {
                    var markers = [];
                    for (var j = 0; j < markerItems.length; j++) {
                        var markerElement = markerItems[j];
                        getLatLngObject(markerElement.getAttribute("data-location"), markerElement, plugins.maps[i], function (location, markerElement, mapElement) {
                            var icon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
                            var activeIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active");
                            var info = markerElement.getAttribute("data-description") || "";
                            var infoWindow = new google.maps.InfoWindow({content: info});
                            markerElement.infoWindow = infoWindow;
                            var markerData = {position: location, map: mapElement.map}
                            if (icon) {
                                markerData.icon = icon;
                            }
                            var marker = new google.maps.Marker(markerData);
                            markerElement.gmarker = marker;
                            markers.push({markerElement: markerElement, infoWindow: infoWindow});
                            marker.isActive = false;
                            google.maps.event.addListener(infoWindow, 'closeclick', (function (markerElement, mapElement) {
                                var markerIcon = null;
                                markerElement.gmarker.isActive = false;
                                markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
                                markerElement.gmarker.setIcon(markerIcon);
                            }).bind(this, markerElement, mapElement));
                            google.maps.event.addListener(marker, 'click', (function (markerElement, mapElement) {
                                if (markerElement.infoWindow.getContent().length === 0) return;
                                var gMarker, currentMarker = markerElement.gmarker, currentInfoWindow;
                                for (var k = 0; k < markers.length; k++) {
                                    var markerIcon;
                                    if (markers[k].markerElement === markerElement) {
                                        currentInfoWindow = markers[k].infoWindow;
                                    }
                                    gMarker = markers[k].markerElement.gmarker;
                                    if (gMarker.isActive && markers[k].markerElement !== markerElement) {
                                        gMarker.isActive = false;
                                        markerIcon = markers[k].markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")
                                        gMarker.setIcon(markerIcon);
                                        markers[k].infoWindow.close();
                                    }
                                }
                                currentMarker.isActive = !currentMarker.isActive;
                                if (currentMarker.isActive) {
                                    if (markerIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active")) {
                                        currentMarker.setIcon(markerIcon);
                                    }
                                    currentInfoWindow.open(map, marker);
                                } else {
                                    if (markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")) {
                                        currentMarker.setIcon(markerIcon);
                                    }
                                    currentInfoWindow.close();
                                }
                            }).bind(this, markerElement, mapElement))
                        })
                    }
                }
            }
        });
    }
    if (plugins.captcha.length) {
        $.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
    }
    if (plugins.radio.length) {
        for (var i = 0; i < plugins.radio.length; i++) {
            $(plugins.radio[i]).addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
        }
    }
    if (plugins.checkbox.length) {
        for (var i = 0; i < plugins.checkbox.length; i++) {
            $(plugins.checkbox[i]).addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
        }
    }
    if (plugins.rdInputLabel.length) {
        plugins.rdInputLabel.RDInputLabel();
    }
    if (plugins.regula.length) {
        attachFormValidator(plugins.regula);
    }
    if (plugins.mailchimp.length) {
        for (i = 0; i < plugins.mailchimp.length; i++) {
            var $mailchimpItem = $(plugins.mailchimp[i]), $email = $mailchimpItem.find('input[type="email"]');
            $mailchimpItem.attr('novalidate', 'true');
            $email.attr('name', 'EMAIL');
            $mailchimpItem.on('submit', $.proxy(function ($email, event) {
                event.preventDefault();
                var $this = this;
                var data = {}, url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
                    dataArray = $this.serializeArray(), $output = $("#" + $this.attr("data-form-output"));
                for (i = 0; i < dataArray.length; i++) {
                    data[dataArray[i].name] = dataArray[i].value;
                }
                $.ajax({
                    data: data, url: url, dataType: 'jsonp', error: function (resp, text) {
                        $output.html('Server error: ' + text);
                        setTimeout(function () {
                            $output.removeClass("active");
                        }, 4000);
                    }, success: function (resp) {
                        $output.html(resp.msg).addClass('active');
                        $email[0].value = '';
                        var $label = $('[for="' + $email.attr('id') + '"]');
                        if ($label.length) $label.removeClass('focus not-empty');
                        setTimeout(function () {
                            $output.removeClass("active");
                        }, 6000);
                    }, beforeSend: function (data) {
                        var isNoviBuilder = window.xMode;
                        var isValidated = (function () {
                            var results, errors = 0;
                            var elements = $this.find('[data-constraints]');
                            var captcha = null;
                            if (elements.length) {
                                for (var j = 0; j < elements.length; j++) {
                                    var $input = $(elements[j]);
                                    if ((results = $input.regula('validate')).length) {
                                        for (var k = 0; k < results.length; k++) {
                                            errors++;
                                            $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
                                        }
                                    } else {
                                        $input.siblings(".form-validation").text("").parent().removeClass("has-error")
                                    }
                                }
                                if (captcha) {
                                    if (captcha.length) {
                                        return validateReCaptcha(captcha) && errors === 0
                                    }
                                }
                                return errors === 0;
                            }
                            return true;
                        })();
                        if (isNoviBuilder || !isValidated)
                            return false;
                        $output.html('Submitting...').addClass('active');
                    }
                });
                return false;
            }, $mailchimpItem, $email));
        }
    }
    if (plugins.campaignMonitor.length) {
        for (i = 0; i < plugins.campaignMonitor.length; i++) {
            var $campaignItem = $(plugins.campaignMonitor[i]);
            $campaignItem.on('submit', $.proxy(function (e) {
                var data = {}, url = this.attr('action'), dataArray = this.serializeArray(),
                    $output = $("#" + plugins.campaignMonitor.attr("data-form-output")), $this = $(this);
                for (i = 0; i < dataArray.length; i++) {
                    data[dataArray[i].name] = dataArray[i].value;
                }
                $.ajax({
                    data: data, url: url, dataType: 'jsonp', error: function (resp, text) {
                        $output.html('Server error: ' + text);
                        setTimeout(function () {
                            $output.removeClass("active");
                        }, 4000);
                    }, success: function (resp) {
                        $output.html(resp.Message).addClass('active');
                        setTimeout(function () {
                            $output.removeClass("active");
                        }, 6000);
                    }, beforeSend: function (data) {
                        if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
                            return false;
                        $output.html('Submitting...').addClass('active');
                    }
                });
                var inputs = $this[0].getElementsByTagName('input');
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].value = '';
                    var label = document.querySelector('[for="' + inputs[i].getAttribute('id') + '"]');
                    if (label) label.classList.remove('focus', 'not-empty');
                }
                return false;
            }, $campaignItem));
        }
    }
    if (plugins.rdMailForm.length) {
        var i, j, k, msg = {
            'MF000': 'Successfully sent!',
            'MF001': 'Recipients are not set!',
            'MF002': 'Form will not work locally!',
            'MF003': 'Please, define email field in your form!',
            'MF004': 'Please, define type of your form!',
            'MF254': 'Something went wrong with PHPMailer!',
            'MF255': 'Aw, snap! Something went wrong.'
        };
        for (i = 0; i < plugins.rdMailForm.length; i++) {
            var $form = $(plugins.rdMailForm[i]), formHasCaptcha = false;
            $form.attr('novalidate', 'novalidate').ajaxForm({
                data: {"form-type": $form.attr("data-form-type") || "contact", "counter": i},
                beforeSubmit: function (arr, $form, options) {
                    if (isNoviBuilder)
                        return;
                    var form = $(plugins.rdMailForm[this.extraData.counter]), inputs = form.find("[data-constraints]"),
                        output = $("#" + form.attr("data-form-output")), captcha = form.find('.recaptcha'),
                        captchaFlag = true;
                    output.removeClass("active error success");
                    if (isValidated(inputs, captcha)) {
                        if (captcha.length) {
                            var captchaToken = captcha.find('.g-recaptcha-response').val(), captchaMsg = {
                                'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
                                'CPT002': 'Something wrong with google reCaptcha'
                            };
                            formHasCaptcha = true;
                            $.ajax({
                                method: "POST",
                                url: "bat/reCaptcha.php",
                                data: {'g-recaptcha-response': captchaToken},
                                async: false
                            }).done(function (responceCode) {
                                if (responceCode !== 'CPT000') {
                                    if (output.hasClass("snackbars")) {
                                        output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')
                                        setTimeout(function () {
                                            output.removeClass("active");
                                        }, 3500);
                                        captchaFlag = false;
                                    } else {
                                        output.html(captchaMsg[responceCode]);
                                    }
                                    output.addClass("active");
                                }
                            });
                        }
                        if (!captchaFlag) {
                            return false;
                        }
                        form.addClass('form-in-process');
                        if (output.hasClass("snackbars")) {
                            output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
                            output.addClass("active");
                        }
                    } else {
                        return false;
                    }
                },
                error: function (result) {
                    if (isNoviBuilder)
                        return;
                    var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
                        form = $(plugins.rdMailForm[this.extraData.counter]);
                    output.text(msg[result]);
                    form.removeClass('form-in-process');
                    if (formHasCaptcha) {
                        grecaptcha.reset();
                    }
                },
                success: function (result) {
                    if (isNoviBuilder)
                        return;
                    var form = $(plugins.rdMailForm[this.extraData.counter]),
                        output = $("#" + form.attr("data-form-output")), select = form.find('select');
                    form.addClass('success').removeClass('form-in-process');
                    if (formHasCaptcha) {
                        grecaptcha.reset();
                    }
                    result = result.length === 5 ? result : 'MF255';
                    output.text(msg[result]);
                    if (result === "MF000") {
                        if (output.hasClass("snackbars")) {
                            output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
                        } else {
                            output.addClass("active success");
                        }
                    } else {
                        if (output.hasClass("snackbars")) {
                            output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
                        } else {
                            output.addClass("active error");
                        }
                    }
                    form.clearForm();
                    if (select.length) {
                        select.select2("val", "");
                    }
                    form.find('input, textarea').trigger('blur');
                    setTimeout(function () {
                        output.removeClass("active error success");
                        form.removeClass('success');
                    }, 3500);
                }
            });
        }
    }
    if ($('#camera01').length > 0) {
        $('#camera01').camera({
            height: '740px',
            playPause: false,
            loader: 'none',
            navigation: true,
            pagination: false,
            overlayer: false,
            time: 4000,
            fx: 'simpleFade',
            onLoaded: function () {
                $('.slider-wrapper')[0].style.height = 'auto';
            },
            onStartTransition: function () {
                $('.camera_nav').fadeOut(300);
            },
            onEndTransition: function () {
                $('.camera_nav').fadeIn(300);
            }
        })
    }
});