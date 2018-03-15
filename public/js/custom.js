$(document).ready(function(){
  setInterval(function(){
      var index = getRandomInt(0, 27);
      $('#slider').hide();
      var img = ''
      $('#slider').html('<img src="public/images/logos/' + winners[index].service + '.png " alt="' + winners[index].service + '"><span>' + winners[index].name + ' has just made $'+ winners[index].amount + ' in <span class="service">' + winners[index].service + '</span></span>');
      $('#slider').fadeIn('slow');

  }, 5000);
});
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var winners = new Array(
    { 'name': 'Robert', 'amount': 203, 'service': 'bitcoin'},
    { 'name': 'Doug', 'amount': 109, 'service': 'monero'},
    { 'name': 'Eon', 'amount': 89, 'service': 'Bitcoin'},
    { 'name': 'Luciano', 'amount': 25, 'service': 'ethereum'},
    { 'name': 'Charles', 'amount': 312, 'service': 'namecoin'},
    { 'name': 'John', 'amount': 88, 'service': 'dash'},
    { 'name': 'Larry', 'amount': 91, 'service': 'nxt'},
    { 'name': 'zandro', 'amount': 20, 'service': 'komodo'},
    { 'name': 'Anthony', 'amount': 38, 'service': 'ethereum'},
    { 'name': 'Doug', 'amount': 286, 'service': 'dash'},
    { 'name': 'Jonathan', 'amount': 985, 'service': 'monero'},
    { 'name': 'William', 'amount': 100, 'service': 'monero'},
    { 'name': 'Steve', 'amount': 27, 'service': 'bitcoin'},
    { 'name': 'Gizzy', 'amount': 85, 'service': 'bitcoin'},
    { 'name': 'Lorenzo', 'amount': 98, 'service': 'peercoin'},
    { 'name': 'Dario', 'amount': 68, 'service': 'litcoin'},
    { 'name': 'Moses', 'amount': 105, 'service': 'bitcoin'},
    { 'name': 'Dementarius', 'amount': 168, 'service': 'bitcoin'},
    { 'name': 'Brian', 'amount': 125, 'service': 'ethereum'},
    { 'name': 'Wade', 'amount': 208, 'service': 'ethereum'},
    { 'name': 'Antonio', 'amount': 306, 'service': 'ethereum'},
    { 'name': 'Roger', 'amount': 89, 'service': 'ethereum'},
    { 'name': 'Vinesh', 'amount': 76, 'service': 'ethereum'},
    { 'name': 'Leo', 'amount': 52, 'service': 'monero'},
    { 'name': 'Billy', 'amount': 789, 'service': 'dash'},
    { 'name': 'Steven', 'amount': 802, 'service': 'bitcoin'},
    { 'name': 'Travis', 'amount': 301, 'service': 'bitcoin'},
    { 'name': 'Miguel', 'amount': 980, 'service': 'bitcoin'}
);
