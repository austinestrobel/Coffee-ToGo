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
        url: 'https://reqres.in/api/',
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
            url: 'https://reqres.in/api/coffee',
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
            url: 'https://reqres.in/api/' + $(this).attr('data-id'),
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
            url: 'https://reqres.in/api/' + $li.attr('data-id'),
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

    var $checkout = $('#checkoutButton');
    var $total = $('#total');



    $checkout.on('click', function () {
        if ($orders('li').length >= 1) {
            $total('p').append(document.createTextNode(`Your cart has ${$orders('li').length} item(s)`)),
                $total('p').append(document.createTextNode(`Your total is ${$orders('li').length * 5}`))
        } else {
            $total('p').append(document.createTextNode('There are no items in your cart'))
        }
    })


});