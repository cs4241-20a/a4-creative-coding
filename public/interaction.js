const visSeven = {
  $schema: 'https://vega.github.io/schema/vega/v4.json',
  width: 350,
  height: 530,
  autosize: 'none',

  signals: [
    {
      name: 'startAngle',
      value: 0,
      bind: { input: 'range', min: 0, max: 6.29, step: 0.01 }
    },
    {
      name: 'endAngle',
      value: 6.29,
      bind: { input: 'range', min: 0, max: 6.29, step: 0.01 }
    },
    {
      name: 'padAngle',
      value: 0,
      bind: { input: 'range', min: 0, max: 0.1 }
    },
    {
      name: 'innerRadius',
      value: 0,
      bind: { input: 'range', min: 0, max: 90, step: 1 }
    },
    {
      name: 'cornerRadius',
      value: 0,
      bind: { input: 'range', min: 0, max: 10, step: 0.5 }
    },
    {
      name: 'sort',
      value: false,
      bind: { input: 'checkbox' }
    }
  ],

  data: [
    {
      name: 'table',
      values: [
        { id: 'China - 18.18%', field: 18.18 },
        { id: 'India - 16.88%', field: 16.88 },
        { id: 'United States - 4.27%', field: 4.27 },
        { id: 'Other - 60.67%', field: 60.67 }
      ],
      transform: [
        {
          type: 'pie',
          field: 'field',
          startAngle: { signal: 'startAngle' },
          endAngle: { signal: 'endAngle' },
          sort: { signal: 'sort' }
        }
      ]
    }
  ],

  scales: [
    {
      name: 'color',
      type: 'ordinal',
      domain: { data: 'table', field: 'id' },
      range: { scheme: 'Turbo' }
    }
  ],
  legends: [
    {
      stroke: 'color',
      title: 'Legend',
      orient: 'top-left',
      encode: {
        symbols: {
          update: {
            fill: { value: '' },
            strokeWidth: { value: 4 },
            size: { value: 60 }
          }
        }
      }
    }
  ],
  marks: [
    {
      type: 'arc',
      from: { data: 'table' },
      encode: {
        enter: {
          fill: { scale: 'color', field: 'id' },
          x: { signal: 'width / 2' },
          y: { signal: 'height / 2' }
        },
        update: {
          startAngle: { field: 'startAngle' },
          endAngle: { field: 'endAngle' },
          padAngle: { signal: 'padAngle' },
          innerRadius: { signal: 'innerRadius' },
          outerRadius: { signal: 'width / 2' },
          cornerRadius: { signal: 'cornerRadius' }
        }
      }
    }
  ]
}

vegaEmbed('#vis7', visSeven)

function popup () {
  'use strict'
  const myWindow = window.open('', 'MsgWindow', 'width=600,height=370')
  myWindow.document.write('<h1>Instructions</h1>' +
          "<p>This is the website for Assignment 4- Creative Coding: Interactive Multimedia Experiences<p> " +
          "<p>Below is basic documentation and instructions for how to use the user interface.<p>" +
          "<p>This website is using a population dataset for India, China, and the United States." +
          "<p>The datasets come from https://github.com/jdorfman/Awesome-JSON-Datasets#population <p>" +
          "This website allows you to compare the populations of the three countries from 1960. " +
        "You can zoom into each of the country graphs by highlighting the area you wish to see zoomed in- to look at the range more closely.</p>" +
          "There is also the pie chart that can be manipulated to show the data as you wish. For more user interaction, the user may save the graph or continue to edit the file in an open-source github project.</p>" +
        "<p>This project can be expanded in the future by including datasets to include more countries. <p>")
}

export { visSeven, popup }
