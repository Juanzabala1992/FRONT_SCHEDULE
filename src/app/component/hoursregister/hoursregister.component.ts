import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, first, map, startWith } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard.service';
import { RegisterService } from 'src/app/services/register.service';
import { SharedService } from 'src/app/services/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import {TwoDigitPipe } from '../../pipes/TwoDigitPipe ';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-hoursregister',
  templateUrl: './hoursregister.component.html',
  styleUrls: ['./hoursregister.component.css']
})


export class HoursregisterComponent implements OnInit {

  b64Data="UEsDBBQABgAIAAAAIQBi7p1oXgEAAJAEAAATAAgCW0NvbnRlbnRfVHlwZXNdLnhtbCCiBAIooAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACslMtOwzAQRfdI/EPkLUrcskAINe2CxxIqUT7AxJPGqmNbnmlp/56J+xBCoRVqN7ESz9x7MvHNaLJubbaCiMa7UgyLgcjAVV4bNy/Fx+wlvxcZknJaWe+gFBtAMRlfX41mmwCYcbfDUjRE4UFKrBpoFRY+gOOd2sdWEd/GuQyqWqg5yNvB4E5W3hE4yqnTEOPRE9RqaSl7XvPjLUkEiyJ73BZ2XqVQIVhTKWJSuXL6l0u+cyi4M9VgYwLeMIaQvQ7dzt8Gu743Hk00GrKpivSqWsaQayu/fFx8er8ojov0UPq6NhVoXy1bnkCBIYLS2ABQa4u0Fq0ybs99xD8Vo0zL8MIg3fsl4RMcxN8bZLqej5BkThgibSzgpceeRE85NyqCfqfIybg4wE/tYxx8bqbRB+QERfj/FPYR6brzwEIQycAhJH2H7eDI6Tt77NDlW4Pu8ZbpfzL+BgAA//8DAFBLAwQUAAYACAAAACEAtVUwI/QAAABMAgAACwAIAl9yZWxzLy5yZWxzIKIEAiigAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKySTU/DMAyG70j8h8j31d2QEEJLd0FIuyFUfoBJ3A+1jaMkG92/JxwQVBqDA0d/vX78ytvdPI3qyCH24jSsixIUOyO2d62Gl/pxdQcqJnKWRnGs4cQRdtX11faZR0p5KHa9jyqruKihS8nfI0bT8USxEM8uVxoJE6UchhY9mYFaxk1Z3mL4rgHVQlPtrYawtzeg6pPPm3/XlqbpDT+IOUzs0pkVyHNiZ9mufMhsIfX5GlVTaDlpsGKecjoieV9kbMDzRJu/E/18LU6cyFIiNBL4Ms9HxyWg9X9atDTxy515xDcJw6vI8MmCix+o3gEAAP//AwBQSwMEFAAGAAgAAAAhACb4+s0+AwAArAcAAA8AAAB4bC93b3JrYm9vay54bWysVV1vmzAUfZ+0/4B4p2C+QaVTCUSrtE1V120vlSYXTPEKmNmmSVX1v+/ahLRd99B1ixJ/XTg+x/dc5/Ddtu+MG8IFZUNmogPHNMhQsZoOV5n55XxtxaYhJB5q3LGBZOYtEea7o7dvDjeMX18ydm0AwCAys5VyTG1bVC3psThgIxkg0jDeYwlTfmWLkRNci5YQ2Xe26zih3WM6mDNCyl+CwZqGVqRg1dSTQc4gnHRYAn3R0lEsaH31Erge8+tptCrWjwBxSTsqbzWoafRVenI1MI4vO5C9RYGx5fAN4YccaNxlJwg926qnFWeCNfIAoO2Z9DP9yLERenIE2+dn8DIk3+bkhqoc7lnx8JWswj1W+ACGnH9GQ2At7ZUUDu+VaMGem2seHTa0I19n6xp4HD/hXmWqM40OC1nWVJI6MyOYsg15ssCnMZ9oB1EXhQ4y7aO9nU+5UZMGT508ByMv8FAZYZi4gXoSjHHcScIHLMmKDRJ8uNP1r57T2KuWgcONM/JzopxAYYG/QCu0uErxpTjFsjUm3mXmKr34IkD+xSQmzCm7KNhm6BiU2MUjb+LnhfAX7sSVkmyD5pnXPP5dP9Dj6eLAU8kNGJ8UHyALn/EN5AQyX+9K9gQOPf5+FxZFUhRRYsVBXFp+cAyjKFhZxdp1HW8FCyi+BxU8TCuGJ9nu8qwwM9P3/hD6iLdLBDnpROuH/e+c3cdS/W/NErtXStWN9pWSjXhwhJoa2290qNkmMy3kgprbp9ONDn6jtWzBUk7kwSPz2ntCr1pgjBAYTZF2FbPMvAvXXrEKEGhPIs/yyzK08iTKrcD1UFC6XpwEgWZkP6Kk706gpntj0H5/z35gBHe0ulbV4cKYp2oLflJrZ9vLWxXuKrC36vSDCXLcRIkmW/lBSN2DsyiwQ75zHDmJbzmlF1h+nLhW7HuutfILtwyisihzYLeU83+4ALXB0+U/RbFsMZfnHFfX8E90RpocCzDSLAj4PiabB3HueEDRX6O15aPEsfI89K2gWHtBhIpVGawfyCr5zSuvn9jWbxMsJyhNVZV6nqp2vVvdLzbzwi5NT2ouPSt0Wf3xdVvLU61Oir0cytEvAAAA//8DAFBLAwQUAAYACAAAACEAgT6Ul/MAAAC6AgAAGgAIAXhsL19yZWxzL3dvcmtib29rLnhtbC5yZWxzIKIEASigAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArFJNS8QwEL0L/ocwd5t2FRHZdC8i7FXrDwjJtCnbJiEzfvTfGyq6XVjWSy8Db4Z5783Hdvc1DuIDE/XBK6iKEgR6E2zvOwVvzfPNAwhi7a0egkcFExLs6uur7QsOmnMTuT6SyCyeFDjm+CglGYejpiJE9LnShjRqzjB1Mmpz0B3KTVney7TkgPqEU+ytgrS3tyCaKWbl/7lD2/YGn4J5H9HzGQlJPA15ANHo1CEr+MFF9gjyvPxmTXnOa8Gj+gzlHKtLHqo1PXyGdCCHyEcffymSc+WimbtV7+F0QvvKKb/b8izL9O9m5MnH1d8AAAD//wMAUEsDBBQABgAIAAAAIQAZzgdADQIAAEMEAAAYAAAAeGwvd29ya3NoZWV0cy9zaGVldDEueG1snJNNj5swEIbvlfofLN/BQELSIGCFkkbdQ6Wqn2djBrACmNrOl6r+9w4gsiulh2glLI2N/bzveMbx06VtyAm0kapLqO96lEAnVCG7KqE/vu+dD5QYy7uCN6qDhF7B0Kf0/bv4rPTB1ACWIKEzCa2t7SPGjKih5cZVPXT4p1S65RanumKm18CL8VDbsMDzVqzlsqMTIdKPMFRZSgE7JY4tdHaCaGi4Rf+mlr2Zaa14BNdyfTj2jlBtj4hcNtJeRyglrYieq05pnjeY98VfckEuGr8Ax2KWGdfvlFoptDKqtC6S2eT5Pv0N2zAubqT7/B/C+Eum4SSHAr6ggrdZ8sMbK3iBLd4IW91gw3Xp6CiLhP4J/HCTrdcrZ5UFK2e5266dzSoLnY9Ztgg3+902DPZ/aRoXEis8ZEU0lAnNfMrSeGyenxLO5lVMLM+/QQPCAgr4lAy9mSt1GDY+45KHODNuGHBcWHmCLTQNUkNs79+TQDgIsJvC63hW24/d/EWTnBvYquaXLGyNkvhqCij5sbFf1fkTyKq2uIrssT2i4roDI7Bf0YobjDqjzI5bnsZanQnWHn2bng8vyY8w/v/JNBbDXrwMgjCDeZ1SL2YnNCtwIGq2PbF7XsFnrivZGdJAORpYU6Inh56LsVX9YGuNbnNlrWrnWY2PFVDMc7F8pVJ2ngzXdHv+6T8AAAD//wMAUEsDBBQABgAIAAAAIQCDTWzIVgcAAMggAAATAAAAeGwvdGhlbWUvdGhlbWUxLnhtbOxZW48bNRR+R+I/WPOe5jaTy6opyrVLu9tW3bSIR2/iZNz1jCPb2W2EKqHyxAsSEiBekHjjASGQQALxwo+p1IrLj+DYM8nYG4de2CJAu5FWGec7x8fnHH8+c3z1rYcJQ6dESMrTTlC9UgkQSSd8StN5J7g3HpVaAZIKp1PMeEo6wYrI4K1rb75xFe+pmCQEgXwq93AniJVa7JXLcgLDWF7hC5LCbzMuEqzgUczLU4HPQG/CyrVKpVFOME0DlOIE1I5BBk0Juj2b0QkJrq3VDxnMkSqpByZMHGnlJJexsNOTqkbIlewzgU4x6wQw05SfjclDFSCGpYIfOkHF/AXla1fLeC8XYmqHrCU3Mn+5XC4wPamZOcX8eDNpGEZho7vRbwBMbeOGzWFj2NjoMwA8mcBKM1tcnc1aP8yxFij76tE9aA7qVQdv6a9v2dyN9MfBG1CmP9zCj0Z98KKDN6AMH23ho167N3D1G1CGb2zhm5XuIGw6+g0oZjQ92UJXoka9v17tBjLjbN8Lb0fhqFnLlRcoyIZNdukpZjxVu3ItwQ+4GAFAAxlWNEVqtSAzPIE87mNGjwVFB3QeQ+ItcMolDFdqlVGlDv/1JzTfTETxHsGWtLYLLJFbQ9oeJCeCLlQnuAFaAwvy9Kefnjz+4cnjH5988MGTx9/mcxtVjtw+Tue23O9fffzHF++j377/8vdPPs2mPo+XNv7ZNx8++/mXv1IPKy5c8fSz75798N3Tzz/69etPPNq7Ah/b8DFNiES3yBm6yxNYoMd+cixeTmIcY+pI4Bh0e1QPVewAb60w8+F6xHXhfQEs4wNeXz5wbD2KxVJRz8w348QBHnLOelx4HXBTz2V5eLxM5/7JxdLG3cX41Dd3H6dOgIfLBdAr9ansx8Qx8w7DqcJzkhKF9G/8hBDP6t6l1PHrIZ0ILvlMoXcp6mHqdcmYHjuJVAjt0wTisvIZCKF2fHN4H/U48616QE5dJGwLzDzGjwlz3HgdLxVOfCrHOGG2ww+win1GHq3ExMYNpYJIzwnjaDglUvpkbgtYrxX0m8Aw/rAfslXiIoWiJz6dB5hzGzngJ/0YJwuvzTSNbezb8gRSFKM7XPngh9zdIfoZ4oDTneG+T4kT7ucTwT0gV9ukIkH0L0vhieV1wt39uGIzTHws0xWJw65dQb3Z0VvOndQ+IIThMzwlBN1722NBjy8cnxdG34iBVfaJL7FuYDdX9XNKJEGmrtmmyAMqnZQ9InO+w57D1TniWeE0wWKX5lsQdSd14ZTzUultNjmxgbcoFICQL16n3Jagw0ru4S6td2LsnF36WfrzdSWc+L3IHoN9+eBl9yXIkJeWAWJ/Yd+MMXMmKBJmjKHA8NEtiDjhL0T0uWrEll65mbtpizBAYeTUOwlNn1v8nCt7on+m7PEXMBdQ8PgV/51SZxel7J8rcHbh/oNlzQAv0zsETpJtzrqsai6rmuB/X9Xs2suXtcxlLXNZy/jevl5LLVOUL1DZFF0e0/NJdrZ8ZpSxI7Vi5ECaro+EN5rpCAZNO8r0JDctwEUMX/MGk4ObC2xkkODqHarioxgvoDVUNc3OucxVzyVacAkdIzNsmqnknG7Td1omh3yadTqrVd3VzFwosSrGK9FmHLpUKkM3mkX3bqPe9EPnpsu6NkDLvowR1mSuEXWPEc31IEThr4wwK7sQK9oeK1pa/TpU6yhuXAGmbaICr9wIXtQ7QRRmHWRoxkF5PtVxyprJ6+jq4FxopHc5k9kZACX2OgOKSLe1rTuXp1eXpdoLRNoxwko31wgrDWN4Ec6z0265X2Ss20VIHfO0K9a7oTCj2XodsdYkco4bWGozBUvRWSdo1CO4V5ngRSeYQccYviYLyB2p37owm8PFy0SJbMO/CrMshFQDLOPM4YZ0MjZIqCICMZp0Ar38TTaw1HCIsa1aA0L41xrXBlr5txkHQXeDTGYzMlF22K0R7ensERg+4wrvr0b81cFaki8h3Efx9Awds6W4iyHFomZVO3BKJVwcVDNvTinchG2IrMi/cwdTTrv2VZTJoWwcs0WM8xPFJvMMbkh0Y4552vjAesrXDA7dduHxXB+wf/vUff5RrT1nkWZxZjqsok9NP5m+vkPesqo4RB2rMuo279Sy4Lr2musgUb2nxHNO3Rc4ECzTiskc07TF2zSsOTsfdU27wILA8kRjh982Z4TXE6968oPc+azVB8S6rjSJby7N7VttfvwAyGMA94dLpqQJJdxZCwxFX3YDmdEGbJGHKq8R4RtaCtoJ3qtE3bBfi/qlSisalsJ6WCm1om691I2ienUYVSuDXu0RHCwqTqpRdmE/gisMtsqv7c341tV9sr6luTLhSZmbK/myMdxc3VdrztV9dg2PxvpmPkAUSOe9Rm3Urrd7jVK73h2VwkGvVWr3G73SoNFvDkaDftRqjx4F6NSAw269HzaGrVKj2u+XwkZFm99ql5phrdYNm93WMOw+yssYWHlGH7kvwL3Grmt/AgAA//8DAFBLAwQUAAYACAAAACEAeaGAbKQCAABSBgAADQAAAHhsL3N0eWxlcy54bWykVW1r2zAQ/j7YfxD67sp24ywJtsvS1FDoxqAd7Ktiy4moXowkZ87G/vtOdl4cOrbRfolO59Nzz91zUtKbTgq0Y8ZyrTIcXYUYMVXqiqtNhr8+FcEMI+uoqqjQimV4zyy+yd+/S63bC/a4ZcwhgFA2w1vnmgUhttwySe2VbpiCL7U2kjrYmg2xjWG0sv6QFCQOwymRlCs8ICxk+T8gkprntglKLRvq+JoL7vY9FkayXNxvlDZ0LYBqF01oibpoamLUmWOS3vsij+Sl0VbX7gpwia5rXrKXdOdkTmh5RgLk1yFFCQnji9o780qkCTFsx718OE9rrZxFpW6VAzGBqG/B4lnp76rwn7xziMpT+wPtqABPhEmellpogxxIB53rPYpKNkTcUsHXhvuwmkou9oM79o5e7UOc5NB77ySex2GxcIgLcWIVewLgyFOQzzGjCtigg/20byC9gkkbYPq4f0RvDN1HcTI6QPqEebrWpoLJPvfj6MpTwWoHRA3fbP3qdAO/a+0cqJ+nFacbrajwpQwgJwPKKZkQj376v9UX2F2NVCsL6e6rDMM98k04mlDIwRzwho3HH6MN2G+GRV19iQ+II9oXpE/pkdc7w5/9dRUwOQcItG65cFz9gTBgVt25BaFXwPmr1zfnlAU6UbGatsI9nT5m+Gx/YhVvZXyK+sJ32vUQGT7bD16paOpzsM49WBgvWFFreIZ/3i0/zFd3RRzMwuUsmFyzJJgny1WQTG6Xq1UxD+Pw9tfoAXjD9e/fqzyFi7WwAh4Jcyj2UOLj2Zfh0Wag388o0B5zn8fT8GMShUFxHUbBZEpnwWx6nQRFEsWr6WR5lxTJiHvyymciJFE0PDiefLJwXDLB1VGro0JjL4gE278UQY5KkPOfQf4bAAD//wMAUEsDBBQABgAIAAAAIQARVzSgnQAAALYAAAAUAAAAeGwvc2hhcmVkU3RyaW5ncy54bWw0jTEOwjAQBHsk/mBdTxwoEEK2UyBRU8ADTHIkluJz8J0R/B5TUM6uRmO6d5zVCzOHRBa2TQsKqU9DoNHC7XreHECxeBr8nAgtfJChc+uVYRZVXWILk8hy1Jr7CaPnJi1I9XmkHL1UzKPmJaMfeEKUOOtd2+519IFA9amQ1C6oQuFZ8PRnZzg4I+6SC9690eKM/i26dt0XAAD//wMAUEsDBBQABgAIAAAAIQDxKi7zPQEAAF8CAAARAAgBZG9jUHJvcHMvY29yZS54bWwgogQBKKAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACUkl9LwzAUxd8Fv0PJe5u0hSml7UBlTw4EJ4pvIbnrgs0fksxu39603brKfPEx95z7u+deUi4Pso2+wTqhVYXShKAIFNNcqKZCb5tVfI8i56nitNUKKnQEh5b17U3JTMG0hRerDVgvwEWBpFzBTIV23psCY8d2IKlLgkMFcautpD48bYMNZV+0AZwRssASPOXUU9wDYzMR0QnJ2YQ0e9sOAM4wtCBBeYfTJMUXrwcr3Z8NgzJzSuGPJux0ijtnczaKk/vgxGTsui7p8iFGyJ/ij/Xz67BqLFR/KwaoLjkrmAXqta33bk+t0CWe1fr7tdT5dTj1VgB/OF5s11KgDeFHJPAoxCnG8GflPX982qxQnZEsj8kizvJNRgpCivTus5/8q7+PNxbkaf5/iHk2I54BdYmvvkT9AwAA//8DAFBLAwQUAAYACAAAACEAJwHspZEBAAAXAwAAEAAIAWRvY1Byb3BzL2FwcC54bWwgogQBKKAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACcksFu2zAMhu8D9g6G7o2cbiiGQFZRpBty2LAASXvnZDrRJkuCxBjJ3mbPshcbbaOJs+3UG8mf+vWJoro/tq7oMGUbfCXms1IU6E2ord9V4mn76eaDKDKBr8EFj5U4YRb3+u0btU4hYiKLuWALnyuxJ4oLKbPZYwt5xrJnpQmpBeI07WRoGmvwMZhDi57kbVneSTwS+hrrm3g2FKPjoqPXmtbB9Hz5eXuKDKzVQ4zOGiB+pf5iTQo5NFR8PBp0Sk5FxXQbNIdk6aRLJaep2hhwuGRj3YDLqOSloFYI/dDWYFPWqqNFh4ZCKrL9yWO7FcU3yNjjVKKDZMETY/VtYzLELmZKehW+Qy5qLMzvX84cXFCS+0ZtCKdHprF9r+dDAwfXjb3ByMPCNenWksP8tVlDov+Az6fgA8OIfUEdr5ziDQ/ni/6yXoY2gj+xcI4+W/8jP8VteATCl6FeF9VmDwlr/ofz0M8FteJ5JtebLPfgd1i/9Pwr9CvwPO65nt/Nyncl/+6kpuRlo/UfAAAA//8DAFBLAQItABQABgAIAAAAIQBi7p1oXgEAAJAEAAATAAAAAAAAAAAAAAAAAAAAAABbQ29udGVudF9UeXBlc10ueG1sUEsBAi0AFAAGAAgAAAAhALVVMCP0AAAATAIAAAsAAAAAAAAAAAAAAAAAlwMAAF9yZWxzLy5yZWxzUEsBAi0AFAAGAAgAAAAhACb4+s0+AwAArAcAAA8AAAAAAAAAAAAAAAAAvAYAAHhsL3dvcmtib29rLnhtbFBLAQItABQABgAIAAAAIQCBPpSX8wAAALoCAAAaAAAAAAAAAAAAAAAAACcKAAB4bC9fcmVscy93b3JrYm9vay54bWwucmVsc1BLAQItABQABgAIAAAAIQAZzgdADQIAAEMEAAAYAAAAAAAAAAAAAAAAAFoMAAB4bC93b3Jrc2hlZXRzL3NoZWV0MS54bWxQSwECLQAUAAYACAAAACEAg01syFYHAADIIAAAEwAAAAAAAAAAAAAAAACdDgAAeGwvdGhlbWUvdGhlbWUxLnhtbFBLAQItABQABgAIAAAAIQB5oYBspAIAAFIGAAANAAAAAAAAAAAAAAAAACQWAAB4bC9zdHlsZXMueG1sUEsBAi0AFAAGAAgAAAAhABFXNKCdAAAAtgAAABQAAAAAAAAAAAAAAAAA8xgAAHhsL3NoYXJlZFN0cmluZ3MueG1sUEsBAi0AFAAGAAgAAAAhAPEqLvM9AQAAXwIAABEAAAAAAAAAAAAAAAAAwhkAAGRvY1Byb3BzL2NvcmUueG1sUEsBAi0AFAAGAAgAAAAhACcB7KWRAQAAFwMAABAAAAAAAAAAAAAAAAAANhwAAGRvY1Byb3BzL2FwcC54bWxQSwUGAAAAAAoACgCAAgAA/R4AAAAA"
  error='';
  id$: any;
  id_user!:string;
  data_user!:any;
  inputArray!: FormArray;
  activate:boolean=false;
  hours:Array<number>=[];
  minutes:Array<number>=[];

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions$!: Observable<string[]>;
  total_horas:string="00:00";
  title = 'form-array';  
  fg!: FormGroup
  dataSourcePacks!: MatTableDataSource<any>;
  displayedColumns = ['activities', 'hours', 'act_initial_date', 'act_final_date', 'eliminar'];

  @ViewChild(MatAutocompleteTrigger) trigger!: MatAutocompleteTrigger;
  
  constructor(private dashboardService:DashboardService, sharedService:SharedService,
    private registerService:RegisterService, private _fb: FormBuilder, private cd: ChangeDetectorRef,
    private _snackBar: MatSnackBar, private router: Router
    ) { 
      this.hours = Array(100).fill(0).map((x,i)=>i);
      this.minutes = Array(60).fill(0).map((x,i)=>i);
        this.id$=sharedService.getId;
  }

  ngOnInit(): void {

    this.fg = this._fb.group({
      promos: this._fb.array([]),
      initial_date: new FormControl(),
      final_date: new FormControl(),
      observations: new FormControl(),
      client:new FormControl(),
      final_client:new FormControl(),
      total_horas:new FormControl()
    });

    this.id$.subscribe((id:string)=>{
      this.id_user=id;
    });

    this.addLesson();
    this.loadData();
    
    this.fg.valueChanges.subscribe(data=>{    
      
      const horas = data.promos.map((info:any)=>{
        return Number(info.hours);
      });
      const minutos = data.promos.map((info:any)=>{
        return Number(info.minutes);
      });
      
      
      let suma_minutos = minutos.reduce((acumulador:number, valorActual:number) => acumulador + valorActual, 0); 
      if(!minutos){
        suma_minutos=0;
      } 
      const total_horas = suma_minutos/60;
      let module = (total_horas%1)*60;

      let suma_horas = horas.reduce((acumulador:number, valorActual:number) => acumulador + valorActual, 0);

      const horas_minutos=Math.floor(total_horas);  
      suma_horas= suma_horas+horas_minutos;

      if(suma_horas<10){
        suma_horas = 0+String(suma_horas);        
      }
      if(module<10){
        this.total_horas=`${suma_horas}:0${module}`; 
      }else{
        this.total_horas=`${suma_horas}:${module}`;
      }
           
    })
  }

  loadData(){
    this.registerService.getUser(this.id_user)
    .pipe(first())
    .subscribe({
        next: (data) => {             
            this.data_user=data;
        },
        error: error => {
            this.error = error;            
        }
    });
  }

  get promos() {
    return this.fg.controls["promos"] as FormArray;
  };

  addLesson(): void {

    const lessonForm = this._fb.group({
      activities: new FormControl(),
      hours: new FormControl('0',Validators.required),
      minutes: new FormControl('0',Validators.required),
      act_final_date: new FormControl(),
      act_initial_date: new FormControl()    
    });

    
    this.promos.push(lessonForm);
    this.dataSourcePacks = new MatTableDataSource(this.promos.controls);

    this.cd.detectChanges();

  };


  deleteLesson(lessonIndex: number): void {

    this.promos.removeAt(lessonIndex);
    this.dataSourcePacks = new MatTableDataSource(this.promos.controls);

  };

  save(){    
    const uuid = uuidv4();  
    const work_hours=this.fg.get('promos')?.value;
    let  result = work_hours.map((data:any)=>{
          let result_hours=Number(data.hours);
          let result_minutes=Number(data.minutes);
          if(result_hours<10){
            `0${data.hours}`
          }
          if(result_minutes<10){
            `0${data.minutes}`
          }
      return {
        hours:`${data.hours}:${data.minutes}`,
        initial_date:data.act_initial_date,
        final_date:data.act_final_date,
        data:data.activities
      };
    })
    let data={
      idUser:this.id_user,
      idSch:uuid,
      nombre:this.data_user.nombre,
      numero_de_documento:this.data_user.numero_de_documento,
      actividades:result,      
      fecha_inicio:this.fg.get('initial_date')?.value,
      fecha_fin:this.fg.get('final_date')?.value,
      //horas_actividad: `${work_hours.hours}:${work_hours.minutes}`,  
      cliente:this.fg.get('client')?.value,
      total_horas: this.total_horas,
      responsable_cliente:this.fg.get('final_client')?.value,
      observaciones: this.fg.get('observations')?.value
    }
   this.dashboardService.scheduleRegister(data)
    .pipe(first())
    .subscribe({
        next: () => {           
            console.log("Todo ok!")
        },
        error: error => {
            this.error = error;            
        }
    });
    this.openSnackBar(
      'Su registro se guardo exitosamente!',
      'OK'
    );
  }

  history(){
    this.router.navigate(['/history']);
  }
  base() {    
    this.b64Data.indexOf(',');
    let _base64Str = this.b64Data.substring(this.b64Data.indexOf(',') + 1);
    var byte = this.base64ToArrayBuffer(_base64Str);
    var blob = new Blob([byte], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    window.open(URL.createObjectURL(blob), '_blank');
  }
  base64ToArrayBuffer(_base64Str: string) {
    var binaryString = window.atob(_base64Str);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['ok-snackbar']
    });
  }
}
