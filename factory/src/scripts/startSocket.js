/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable no-loop-func */
/* eslint-disable camelcase */

socket.on('newOrder', data => {
  console.log(data);

  // A product is { id: 5, quantity: 70 }
  const productsToProduce = data.products || [];

  productsToProduce
    .forEach(productToProduce => {
      fetch(
        'https://3na66-factory-prod.azurewebsites.net/api/v1/production-lines/suggest-production-line',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
          body: JSON.stringify({ product: productToProduce.id }),
        }
      )
        .then(response => {
          return response.json();
        })
        .then(result => {
          console.log('result', result);
          const productionLineIDForProduct = result.productionLine || 1; // Add new endpoint here!

          const productionLineIndex = PRODUCTION_LINES.findIndex(
            pl => pl.id === productionLineIDForProduct
          );

          if (typeof PRODUCTION_LINES[productionLineIndex] === 'undefined') {
            // eslint-disable-next-line no-useless-return
            return;
          }

          console.log('productToProduce', productToProduce);

          let producedProducts = 0;

          function ___produceProduct(index) {
            const productObject = buildProduct({
              productionLine: index,
            });

            const sound_machine_1 = document.getElementById('sound_machine_1');

            sound_machine_1.play();

            productObject.product.position.set(
              GLOBALS.productionLine.largura * (index - 1) +
                GLOBALS.productionLine.largura / 2 +
                GLOBALS.productionLine.largura -
                (GLOBALS.productionLine.largura * PRODUCTION_LINES.length) / 2,
              10,
              PRODUCT_STARTING_POINT_Y
            );

            scene.add(productObject.product);
            PRODUCTS.push(productObject);

            setTimeout(() => {
              scene.remove(productObject.product);
              sound_machine_1.pause();
              if (producedProducts < productToProduce.quantity - 1) {
                producedProducts += 1;
                ___produceProduct(index);
              }
            }, PRODUCTION_LINES[index].machines.length * 3300);
          }

          ___produceProduct(productionLineIndex);
        });
    })
    .catch(error => {
      console.log('Request failed', error);
    });
});
