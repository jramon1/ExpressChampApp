$(function(){

  $.getJSON('/api/all', function(data){
    // window.data = data;

    console.log('all data', data)

    var matchData = {};
    // {
    //  id: 1,
    //  data: [[1234564, 31    // }
    var roleData = {};

    data.matches.filter(function(match) {
     return match.role !== 'NONE';
    }).forEach(function(match) {
      if(roleData.hasOwnProperty(match.role))  {
        roleData[match.role] = parseInt(roleData[match.role])+1
      } else {
        roleData[match.role] = 1
      }


      // roleData[match.role] =  roleData[match.role] || 0;
      // ++roleData[match.role];
    })
    var keyCount = Object.keys(roleData).length
    var totalRecords = 0;
    for(role in roleData) {
      totalRecords += roleData[role]
    }
    for(role in roleData) {
      roleData[role] = roleData[role]/totalRecords
    }

       console.debug(roleData)

           var $search = $('#search');
      var $champions = $('.champions')

    var filter = {
      search: ''
    }

    function updateView(){
      console.log('Filter', filter);

      $champions.html('')

      // do the filtering
      data.champions.forEach(function(champ){

        var match = champ.name.indexOf( filter.search )>-1;
        //
        if(
          // Text match
          match &&
          // Filter by assassin
          (!filter.Fighter || (filter.Fighter && champ.tags.indexOf("Fighter") > -1)) &&
          (!filter.Assassin || (filter.Assassin && champ.tags.indexOf("Assassin") > -1))
        ) {
          // Add to HTML
          $champions.append('<div class="champion"> <h5>'+champ.name+'</h5> <img src="'+champ.imgsrc+'"/> </div>');
        }

      })
      // update the html for $('.champions')

    }

    $search.keyup(function(){
      var val = $search.val();
      filter.search = val;
      console.log('Search',val);
      updateView();
    })

    $('input[type=checkbox]').change(function(e){
      console.log('checkbox', this.value, this.checked);
      filter[this.value] = this.checked;
      updateView();
    })




    $('.bs-example-modal-sm').on('shown.bs.modal', function (e) {
      console.log('opening popup', e)


      // figure out which champ is being called
      var champ_id = e.relatedTarget.dataset.id;
      console.log('champ id:', champ_id);

      var i = 0, len = data.champions.length;
      for(;i<len; i++){
        if( +data.champions[i].id === +champ_id ) { break; }
      }

      var champion = data.champions[i];

      console.log('CHampion:', champion )

      // display his data in the chart



      const CHART = document.getElementById("lineChart");
      const chartLabels = Object.keys(roleData)
      var chartData = {
          labels: chartLabels,
          datasets: [
              {
                  label: "Roles",
                  backgroundColor: 'lightblue',
                  borderColor: 'blue',
                  borderWidth: 1,
                  data: chartLabels.map(function (cLabel) { return Math.round(roleData[cLabel] * 100, 2); })
              }
          ]
      };
      let myChart = new Chart(CHART, {
        type: 'horizontalBar',
        data: chartData
     });
    });



    $('.bs-example-modal-sm').on('hide.bs.modal', function (e) {
      // popup gets closed - cleanup the chart
      //
    });






  })



})
