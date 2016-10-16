var buildingLocations = [ { name: 'HUT', lat: '47.659636', long: '-122.306680' },
  { name: 'SMI', lat: '47.656422', long: '-122.307496' },
  { name: 'CMU', lat: '47.657117', long: '-122.305271' },
  { name: 'SIG', lat: '47.654863', long: '-122.306555' },
  { name: 'EEB', lat: '47.653629', long: '-122.306590' },
  { name: 'SAV', lat: '47.657247', long: '-122.308311' },
  { name: 'MGH', lat: '47.654962', long: '-122.307931' },
  { name: 'KNE', lat: '47.656627', long: '-122.309164' },
  { name: 'CDH', lat: '47.656645', long: '-122.316086' },
  { name: 'DEM', lat: '47.659146', long: '-122.307738' },
  { name: 'THO', lat: '47.656533', long: '-122.305829' },
  { name: 'ARC', lat: '47.654659', long: '-122.310791' },
  { name: 'LOW', lat: '47.654252', long: '-122.304506' },
  { name: 'MEB', lat: '47.653625', long: '-122.304722' },
  { name: 'JHN', lat: '47.654557', long: '-122.308928' },
  { name: 'OUG', lat: '47.656443', long: '-122.310430' },
  { name: 'BAG', lat: '47.653450', long: '-122.308871' },
  { name: 'BNS', lat: '47.653168', long: '-122.309644' },
  { name: 'DEN', lat: '47.658436', long: '-122.308872' },
  { name: 'MOR', lat: '47.652515', long: '-122.304841' },
  { name: 'ART', lat: '47.658525', long: '-122.306438' },
  { name: 'FSH', lat: '47.653212', long: '-122.316566' },
  { name: 'GLD', lat: '47.654886', long: '-122.312733' },
  { name: 'CHL', lat: '47.653678', long: '-122.309729' },
  { name: 'RAI', lat: '47.657905', long: '-122.307326' },
  { name: 'PDL', lat: '47.656933', long: '-122.304389' },
  { name: 'LEW', lat: '47.658826', long: '-122.305376' },
  { name: 'MLR', lat: '47.657098', long: '-122.306406' },
  { name: 'SWS', lat: '47.657538', long: '-122.312371' },
  { name: 'PAB', lat: '47.653569', long: '-122.311209' },
  { name: 'HPT', lat: '47.660687', long: '-122.308076' },
  { name: 'HSD', lat: '47.650018', long: '-122.309375' },
  { name: 'MUE', lat: '47.652249', long: '-122.305302' },
  { name: 'PAR', lat: '47.657517', long: '-122.310194' },
  { name: 'HST', lat: '47.650893', long: '-122.309078' },
  { name: 'OTB', lat: '47.650484', long: '-122.312704' },
  { name: 'GUG', lat: '47.654243', long: '-122.306327' },
  { name: 'MKZ', lat: '47.658706', long: '-122.307312' },
  { name: 'CLK', lat: '47.654243', long: '-122.306329' },
  { name: 'CSH', lat: '47.653006', long: '-122.299792' },
  { name: 'HSA', lat: '47.650257', long: '-122.308060' },
  { name: 'AND', lat: '47.651731', long: '-122.307580' },
  { name: 'PAA', lat: '47.652984', long: '-122.311022' },
  { name: 'MUS', lat: '47.657616', long: '-122.305707' },
  { name: 'WFS', lat: '47.651504', long: '-122.306833' },
  { name: 'MAH', lat: '47.655662', long: '-122.316032' },
  { name: 'ACC', lat: '47.653047', long: '-122.314871' },
  { name: 'BLD', lat: '47.651295', long: '-122.307664' },
  { name: 'GWN', lat: '47.656398', long: '-122.307848' },
  { name: 'OCN', lat: '47.651285', long: '-122.312613' },
  { name: 'MAR', lat: '47.652529', long: '-122.314952' },
  { name: 'HCK', lat: '47.651901', long: '-122.311505' },
  { name: 'FTR', lat: '47.652567', long: '-122.315577' },
  { name: 'OCE', lat: '47.649152', long: '-122.310617' },
  { name: 'ATG', lat: '47.653967', long: '-122.309418' },
  { name: 'DRC', lat: '47.657746', long: '-122.288874' },
  { name: 'HSK', lat: '47.651156', long: '-122.311652' },
  { name: 'OBS', lat: '47.660340', long: '-122.309269' },
  { name: 'CMA', lat: '47.659847', long: '-122.292283' },
  { name: 'MNY', lat: '47.655594', long: '-122.310527' },
  { name: 'LAW', lat: '47.659310', long: '-122.310850' },
  { name: 'HSE', lat: '47.650497', long: '-122.309152' },
  { name: 'PAT', lat: '47.653358', long: '-122.311711' },
  { name: 'GTH', lat: '47.653954', long: '-122.310909' },
  { name: 'GA1', lat: '47.654046', long: '-122.311770' },
  { name: 'HSI', lat: '47.651187', long: '-122.310740' },
  { name: 'HSR', lat: '47.649537', long: '-122.308388' },
  { name: 'HSB', lat: '47.649812', long: '-122.308932' },
  { name: 'HSJ', lat: '47.651482', long: '-122.311132' },
  { name: 'HSH', lat: '47.650674', long: '-122.310652' },
  { name: 'CSE', lat: '47.653299', long: '-122.305825' },
  { name: 'UMC', lat: '47.649450', long: '-122.307210' },
  { name: 'ICT', lat: '47.655059', long: '-122.314784' },
  { name: 'EGL', lat: '47.658099', long: '-122.312415' },
  { name: 'BMM', lat: '47.660686', long: '-122.310517' },
  { name: 'KIN', lat: '47.652652', long: '-122.310618' },
  { name: 'NPL', lat: '47.660063', long: '-122.302834' },
  { name: 'CHB', lat: '47.652952', long: '-122.308354' },
  { name: 'ALD', lat: '47.655654', long: '-122.313859' },
  { name: 'MSB', lat: '47.649880', long: '-122.312840' },
  { name: 'HHL', lat: '47.649960', long: '-122.311505' }
]