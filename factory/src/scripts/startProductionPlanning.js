/* eslint-disable no-undef */
/* eslint-disable camelcase */

let currentSeconds = 0;

setInterval(() => {
  currentSeconds++;
  $('#timeSec').html(currentSeconds);
  $('#ppPanel').html('');
  lstProductionPlanning.forEach(pp => {
    $('#ppPanel').append(`<b>Machine ${pp.machine.split('m')[1]}</b><br />`);
    pp.tasks.forEach(task => {
      if (task.toTime > currentSeconds && task.fromTime < currentSeconds) {
        $('#ppPanel').append(
          `<b>Action:</b> ${task.action} (${task.fromTime} - ${task.toTime})<br />`
        );
        if (task.action === 'setup') {
          $('#ppPanel').append(`<b>Tool:</b> ${task.bodyAction.tool}<br />`);
        } else {
          $('#ppPanel').append(
            `<b>Product:</b> ${task.bodyAction.product}<br />`
          );
          $('#ppPanel').append(
            `<b>Client:</b> ${task.bodyAction.client}<br />`
          );
        }
      }
    });
    $('#ppPanel').append('<br />');
  });
}, 1000);

$('body').append(`
<section  style="position: absolute; top: 0; left: 0; background: black; color: white; padding: 1rem 1rem 0;">

<h4>Current Time: <span id="timeSec">0</span></h4>
<h3>Current Actions:</h3>
  <div id="ppPanel">

  </div>

</section>
`);
