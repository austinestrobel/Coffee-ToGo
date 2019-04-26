$(function () {
    var $orders = $('#orders');
    var $name = $('#name');
    var $drink = $('#drink');

    var $enter = $('#add-order');

    //Using mustache
    var orderTemplate = $('#order-template').html();

    function addOrder(order) {
        $orders.append(Mustache.render(orderTemplate, order));
    }


    //Using JSON for example, could use given API
    $.ajax({
        type: 'GET',
        url: 'http://rest.learncode.academy/api/Austin/Coffee/',
        success: function (orders) {
            $.each(orders, function (i, order) {
                addOrder(order);
            });
        },
        error: function () {
            console.log('error loading orders');
        }
    });

    $enter.on('click', function () {
        var order = {
            name: $name.val(),
            drink: $drink.val(),
        };

        $.ajax({
            type: 'POST',
            url: 'http://rest.learncode.academy/api/Austin/Coffee/',
            data: order,
            success: function (newOrder) {
                addOrder(newOrder);
            },
            error: function () {
                console.log('error saving order');
            }
        });

        $name.val('');
        $drink.val('');
    });

    $name.keypress(function (e) {
        if (e.which == 13) {
            $enter.click();
        }
    });

    $drink.keypress(function (e) {
        if (e.which == 13) {
            $enter.click();
        }
    });

    $orders.delegate('.remove', 'click', function () {
        //cannot use this inside of a success function!!
        var $li = $(this).closest('li');
        $.ajax({
            type: 'DELETE',
            url: 'http://rest.learncode.academy/api/Austin/Coffee/' + $(this).attr('data-id'),
            success: function () {
                $li.fadeOut(300, function () {
                    $(this).remove();
                });
            }
        });
    });

    $orders.delegate('.editOrder', 'click', function () {
        var $li = $(this).closest('li');
        $li.find('input.name').val($li.find('span.name').html());
        $li.find('input.drink').val($li.find('span.drink').html());
        $li.addClass('edit');
    });

    $orders.delegate('.cancelEdit', 'click', function () {
        $(this).closest('li').removeClass('edit');
    });

    $orders.delegate('.saveEdit', 'click', function () {
        var $li = $(this).closest('li');
        var order = {
            name: $li.find('input.name').val(),
            drink: $li.find('input.drink').val()
        };

        $.ajax({
            type: 'PUT',
            url: 'http://rest.learncode.academy/api/Austin/Coffee/' + $li.attr('data-id'),
            data: order,
            success: function (newOrder) {
                $li.find('span.name').html(order.name);
                $li.find('span.drink').html(order.drink);
                $li.removeClass('edit');
            },
            error: function () {
                console.log('error updating order');
            }
        });
    });



    // Checkout

    // var $checkout = $('#checkoutButton');
    // var $total = $('#total');



    // $checkout.on('click', function () {
    //     if ($orders.length >= 1) {
    //         $total.html(`Your cart has ${$orders.length} item(s)`),
    //             $total.html(`Your total is ${$orders.length * 5}`)
    //     } else {
    //         $total.html('There are no items in your cart')
    //     }
    // })


});