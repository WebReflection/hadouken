// test
var howMany = 10000;

var time = Date.now();
var T = hadouken('<div><h3>{{title}}</h3><p>{{before}} <a href="{{href}}">{{inside}}</a> {{after}}</p></div>');
time = Date.now() - time;
console.log("it took ", +time, " to generate the template constructor");

time = Date.now();
for (var i = 0, allNodes = []; i < howMany; allNodes[i++] = new T);
time = Date.now() - time;
console.log("it took ", +time, " to generate ", allNodes.length, " template nodes");

for (var i = 0, fragment = document.createDocumentFragment(); i < howMany; fragment.appendChild(allNodes[i++].root));
document.body.appendChild(fragment);

function updateThemAll() {
  for (var i = 0, allObjects = []; i < howMany; allObjects[i++] = {
    title: Math.random(),
    before: Math.random(),
    href: "http://webreflection.blogspot.com/?" + Math.random(),
    inside: Math.random(),
    after: Math.random()
  });

  time = Date.now();
  for (var i = 0; i < howMany; i++) {
    allNodes[i].update(allObjects[i]);
  }
  time = Date.now() - time;
  console.log("it took ", +time, " to update all generated nodes");
}
updateThemAll();

setTimeout(updateThemAll, 5000);

/*

t = Date.now() - t;
document.body.appendChild(t.root);
(function update() {
  t.update({
    title: Math.random(),
    before: Math.random(),
    href: "http://webreflection.blogspot.com/?" + Math.random(),
    inside: Math.random(),
    after: Math.random()
  });
  return;
  (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    setTimeout
  )(update);
}());



<script type="text/template">
<div>
  <h3>{{title}}</h3>
  <p>
    {{before}} <a href="{{href}}">{{inside}}</a> {{after}}
  </p>
</div>
</script>
*/