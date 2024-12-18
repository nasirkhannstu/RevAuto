/*-----------------------------------------------------------------

Template Name: RevAuto - Car Dealer & Services Html Template
Author:  namespace-it
Author URI: https://themeforest.net/user/namespace-it/portfolio
Version: 1.0.0
Description: RevAuto - Car Dealer & Services Html Template<

-------------------------------------------------------------------
CSS TABLE OF CONTENTS
-------------------------------------------------------------------

01. header
02. animated text with swiper slider
03. magnificPopup
04. counter up
05. wow animation
06. nice select
07. swiper slider
08. search popup
09. mousecursor 
09. preloader 


------------------------------------------------------------------*/

(function ($) {
  "use strict";

  $(document).ready(function () {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 250) {
        $("#header-sticky").addClass("sticky");

        $(".navbar-2-address-bar").addClass("display-none");
      } else {
        $("#header-sticky").removeClass("sticky");
        $(".navbar-2-address-bar").removeClass("display-none");
      }
    });

    //>> Wow Animation Start <<//
    new WOW().init();

    //>> Back To Top Start <<//
    $(window).scroll(function () {
      if ($(this).scrollTop() > 20) {
        $("#back-top").addClass("show");
      } else {
        $("#back-top").removeClass("show");
      }
    });
    $("#back-top").click(function () {
      $("html, body").animate({ scrollTop: 0 }, 800);
      return false;
    });
    // Back to top btn area end here ***

    // main chart data
    const weeklyData = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        [9000, 19000, 27000, 15000, 18000, 17000, 22000],
        [8000, 12000, 23000, 17000, 9000, 15000, 19000],
        [7000, 11000, 17000, 19000, 18000, 16000, 21000],
      ],
    };

    const lastWeekData = { ...weeklyData };
    const thisMonthData = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        [40000, 50000, 30000, 45000],
        [35000, 42000, 28000, 37000],
        [32000, 34000, 24000, 31000],
      ],
    };

    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: weeklyData.labels,
        datasets: [
          {
            label: "Orders",
            data: weeklyData.datasets[0],
            borderColor: "#2196F3",
            pointBackgroundColor: "#fff",
            pointBorderColor: "#2196F3",
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 6,
            tension: 0.4,
          },
          {
            label: "Sale",
            data: weeklyData.datasets[1],
            borderColor: "#4CAF50",
            pointBackgroundColor: "#fff",
            pointBorderColor: "#4CAF50",
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 6,
            tension: 0.4,
          },
          {
            label: "User",
            data: weeklyData.datasets[2],
            borderColor: "#FFC107",
            pointBackgroundColor: "#fff",
            pointBorderColor: "#FFC107",
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 6,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });

    // Toggle dataset visibility
    document
      .getElementById("legend-orders")
      .addEventListener("click", () => toggleDataset(0));
    document
      .getElementById("legend-sale")
      .addEventListener("click", () => toggleDataset(1));
    document
      .getElementById("legend-user")
      .addEventListener("click", () => toggleDataset(2));

    function toggleDataset(index) {
      const meta = myChart.getDatasetMeta(index);
      meta.hidden = meta.hidden === null ? true : !meta.hidden;
      myChart.update();
      document
        .querySelectorAll(".legend-btn")
        [index].classList.toggle("hidden", meta.hidden);
    }

    // Dropdown functionality
    document
      .querySelectorAll("#dropdownMenu .dropdown-item")
      .forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const timeframe = e.target.dataset.timeframe;
          changeTimeframe(timeframe);
          document.getElementById("dropdownButton").innerText = timeframe;
        });
      });

    function changeTimeframe(timeframe) {
      let newLabels, newData;
      if (timeframe === "This Week") {
        newLabels = weeklyData.labels;
        newData = weeklyData.datasets;
      } else if (timeframe === "Last Week") {
        newLabels = lastWeekData.labels;
        newData = lastWeekData.datasets;
      } else {
        newLabels = thisMonthData.labels;
        newData = thisMonthData.datasets;
      }

      myChart.data.labels = newLabels;
      myChart.data.datasets.forEach((dataset, i) => {
        dataset.data = newData[i];
      });
      myChart.update();
    }

    // map chart data
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-50m.json")
      .then((response) => response.json())
      .then((topology) => {
        // Convert TopoJSON to GeoJSON
        const countries = ChartGeo.topojson.feature(
          topology,
          topology.objects.countries
        );

        // Prepare random revenue data
        const data = countries.features.map((feature) => ({
          feature: feature,
          value: Math.floor(Math.random() * 1000) + 100, // Random revenue
        }));

        // Initialize Chart.js Choropleth Map
        const ctx = document.getElementById("worldMapChart").getContext("2d");
        new Chart(ctx, {
          type: "choropleth",
          data: {
            labels: countries.features.map((d) => d.properties.name),
            datasets: [
              {
                label: "Revenue by Region",
                outline: countries,
                data: data,
              },
            ],
          },
          options: {
            showOutline: true,
            showGraticule: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `${context.chart.data.labels[context.dataIndex]}: $${
                      context.raw.value
                    }`;
                  },
                },
              },
            },
            scales: {
              xy: {
                projection: "equalEarth",
              },
            },
            elements: {
              geoFeature: {
                backgroundColor: (context) => {
                  const value = context.raw?.value || 0;
                  return getColor(value);
                },
                borderColor: "#ffffff",
                borderWidth: 1,
              },
            },
          },
        });

        function getColor(value) {
          if (value > 700) return "#0d47a1";
          if (value > 500) return "#1976d2";
          if (value > 300) return "#42a5f5";
          return "#bbdefb";
        }
      })
      .catch((error) => console.error("Error fetching map data:", error));

    // Get chart context
    const revenueByAdsChart = document
      .getElementById("revenueByAdsChart")
      .getContext("2d");

    // Chart data
    const data = {
      labels: ["Fashion", "Gadget", "Books", "Sports", "Grocery"],
      datasets: [
        {
          label: "Values",
          data: [38.6, 30.8, 22.5, 28.99, 20.1],
          backgroundColor: [
            "rgba(255, 99, 132)",
            "rgba(54, 162, 235)",
            "rgba(255, 206, 86)",
            "rgba(75, 192, 192)",
            "rgba(153, 102, 255)",
          ],
          borderColor: "#E8E8E8",
          borderWidth: 0,
        },
      ],
    };

    // Chart options
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        r: {
          grid: {
            color: "#E8E8E8",
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      },
    };

    // Initialize Polar Area Chart
    new Chart(revenueByAdsChart, {
      type: "polarArea",
      data: data,
      options: options,
    });

    //>> Mouse Cursor Start <<//
    function mousecursor() {
      if ($("body")) {
        const e = document.querySelector(".cursor-inner"),
          t = document.querySelector(".cursor-outer");
        let n,
          i = 0,
          o = !1;
        (window.onmousemove = function (s) {
          o ||
            (t.style.transform =
              "translate(" + s.clientX + "px, " + s.clientY + "px)"),
            (e.style.transform =
              "translate(" + s.clientX + "px, " + s.clientY + "px)"),
            (n = s.clientY),
            (i = s.clientX);
        }),
          $("body").on("mouseenter", "a, .cursor-pointer", function () {
            e.classList.add("cursor-hover"), t.classList.add("cursor-hover");
          }),
          $("body").on("mouseleave", "a, .cursor-pointer", function () {
            ($(this).is("a") && $(this).closest(".cursor-pointer").length) ||
              (e.classList.remove("cursor-hover"),
              t.classList.remove("cursor-hover"));
          }),
          (e.style.visibility = "visible"),
          (t.style.visibility = "visible");
      }
    }
    $(function () {
      mousecursor();
    });
  }); // End Document Ready Function

  function loader() {
    $(window).on("load", function () {
      // Animate loader off screen
      $(".preloader").addClass("loaded");
      $(".preloader").delay(600).fadeOut();
    });
  }

  loader();
})(jQuery); // End jQuery
